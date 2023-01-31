import mysql from 'promise-mysql';

const MAX_LIMIT: number = 2**63 - 1;
const ALLOWED_JUNCTORS: Array<string> = [
    'AND',
    'OR',
    'NOT'
];
const ALLOWED_COMPARATORS: Array<string> = [
    'IN',
    '=',
    '<',
    '>',
    '<=',
    '>=',
    '<>',
    '!='
];

/**
 * Promise containing a database connection pool.
 */
export const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'cd##E6audiA8',
    database: 'wiretv'
});

/**
 * Queries the database for one or more records.
 * @param table Name of the table to query
 * @param match Object containing keys and values to match with WHERE
 * @param opts Object containing options like the match junctor or a result limit
 * @returns A new Promise containing the query's results
 */
export const find = async (table: string, match: any = {}, opts: any = {}): Promise<any> => {
    opts.junctor = validateJunctor(opts.junctor);
    opts.comparator = validateComparator(opts.comparator);
    opts.limit ??= MAX_LIMIT;
    opts.offset ??= 0;
    opts.orderBy ??= 1;
    opts.sort = opts.desc ? 'DESC' : 'ASC';

    const comparison = opts.comparator == 'IN' ? 'IN (?)' : `${opts.comparator} ?`;

    const db = await connection;
    const ccount = Object.keys(match).length;

    const sql = (
        'SELECT * FROM ??' + 
        (ccount > 0 ? ' WHERE ' : '') +
        Array(ccount)
            .fill(`?? ${comparison}`)
            .join(` ${opts.junctor.trim()} `))
            .trim() + 
        ` ORDER BY ${opts.orderBy.constructor == Number ? '?' : '??'} ${opts.sort} LIMIT ?, ?`;

    const filterInserts = Array(ccount * 2);
    let i = 0;
    for(let k in match){
        filterInserts[i] = k;
        filterInserts[i+1] = match[k];
        i += 2;
    }
    const inserts = [table, ...filterInserts, opts.orderBy, opts.offset, opts.limit];

    return db.query(mysql.format(sql, inserts));
}

/**
 * Queries the database for a single record.
 * @param table Name of the table to query
 * @param match Object containing keys and values to match with WHERE
 * @param opts Object containing options like the match junctor
 * @returns A new Promise containing the query's result
 */
export const findOne = async (table: string, match: any, opts: any = {}): Promise<any> => {
    opts.junctor ??= 'AND';
    opts.limit = 1;

    const results = await find(table, match, opts);
    return results[0];
}

/**
 * Inserts a record into the database.
 * @param table Name of the table to insert record into
 * @param data Object containing keys and values to insert
 * @returns A new Promise containing information about the operation's result
 */
export const insert = async (table: string, data: any) => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const sql = 'INSERT INTO ?? (??) VALUES (?)';
    const inserts = [table, columns, values];
    const db = await connection;

    return db.query(mysql.format(sql, inserts));
}

/**
 * Updates one or more records in the database.
 * @param table Name of the table to update records in
 * @param data Object containing keys and values to set
 * @param match Object containing keys and values to match with WHERE
 * @param opts Object containing options like the match junctor or a result limit
 * @returns A new Promise containing information about the operation's result
 */
export const update = async (table: string, data: any, match: any, opts: any = {}): Promise<any> => {
    const dkCount = Object.keys(data).length;
    
    if(dkCount == 0)
        return 0;
    
    opts.junctor ??= 'AND';
    opts.limit ??= MAX_LIMIT;

    const db = await connection;
    const mkCount = Object.keys(match).length;
    
    const sql = (
        'UPDATE ?? SET ' +
        Array(dkCount)
            .fill('?? = ?')
            .join(', ')
            .trim() + 
        ' WHERE ' +
        Array(mkCount)
            .fill('?? = ?')
            .join(` ${opts.junctor.trim()} `))
            .trim() + 
        ' LIMIT ?';


    let di = 0;
    const dataInserts = Array(dkCount * 2);
    for(let k in data){
        dataInserts[di] = k;
        dataInserts[di+1] = data[k];
        di += 2;
    }

    let fi = 0;
    const filterInserts = Array(mkCount * 2);
    for(let k in match){
        filterInserts[fi] = k;
        filterInserts[fi+1] = match[k];
        fi += 2;
    }

    const inserts = [table, ...dataInserts, ...filterInserts, opts.limit];

    return db.query(mysql.format(sql, inserts));
}

/**
 * Deletes one or more records from the database.
 * @param table Name of the table to delete records from
 * @param match Object containing keys and values to match with WHERE
 * @param opts Object containing options like the match junctor or a result limit
 * @returns A new Promise containing information about the operation's result
 */
export const remove = async (table: string, match: any, opts: any = {}): Promise<any> => {
    const mkCount = Object.keys(match).length;
    
    if(mkCount == 0)
        return 0;
    
    opts.junctor ??= 'AND';
    opts.limit ??= MAX_LIMIT;

    const db = await connection;
    const sql = (
        'DELETE FROM ?? WHERE ' + 
        Array(mkCount)
            .fill('?? = ?')
            .join(` ${opts.junctor.trim()} `))
            .trim() + 
        ' LIMIT ?';

    const filterInserts = Array(mkCount * 2);
    let i = 0;
    for(let k in match){
        filterInserts[i] = k;
        filterInserts[i+1] = match[k];
        i += 2;
    }
    const inserts = [table, ...filterInserts, opts.limit];

    return db.query(mysql.format(sql, inserts));
}

/**
 * Checks if the database contains a record matching the specified criteria.
 * @param table Name of the table to check
 * @param match Object containing keys and values to match with WHERE
 * @param opts Object containing options like the match junctor or a result limit
 * @returns True if a record matching the specified criteria was found
 */
export const has = async (table: string, match: any, opts: any = {}): Promise<boolean> => {
    return !!(await findOne(table, match, opts));
}

/**
 * Checks if the provided junctor string is SQL-valid
 * @param junctor The junctor to validate
 * @returns The junctor itself (in uppercase) if successful
 */
const validateJunctor = (junctor: string | undefined): string => {
    if(!junctor)
        return ALLOWED_JUNCTORS[0];
    
    const junct = ALLOWED_JUNCTORS.find(j => j == junctor.toUpperCase())

    if(!junct)
        throw new InvalidJunctorError(junctor);

    return junct;
}

/**
 * Checks if the provided comparator string is SQL-valid
 * @param comparator The comparator to validate
 * @returns The comparator itself if successful
 */
 const validateComparator = (comparator: string | undefined): string => {
    if(!comparator)
        return ALLOWED_COMPARATORS[0];
    
    const comp = ALLOWED_COMPARATORS.find(j => j == comparator.toUpperCase())

    if(!comp)
        throw new InvalidJunctorError(comparator);

    return comp;
}

class InvalidJunctorError extends Error {
    constructor(junctor: string, msg: string = 'Invalid junctor'){
        super(msg + 
            (junctor ? ` (${junctor})!` : '!') +
            '\nAllowed junctors: ' + ALLOWED_JUNCTORS.join(', '));
    }
}


class InvalidComparatorError extends Error {
    constructor(junctor: string, msg: string = 'Invalid comparator'){
        super(msg + 
            (junctor ? ` (${junctor})!` : '!') +
            '\nAllowed comparators: ' + ALLOWED_COMPARATORS.join(', '));
    }
}