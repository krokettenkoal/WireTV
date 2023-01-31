export const clampText = (text: string, maxLength: number = 200, ellipsis: string = ' ...'): string => {        
    if(!text || text.length <= maxLength)
        return text;

    text = text.slice(0, maxLength + 1 - ellipsis.length);
    text = text.slice(0, text.lastIndexOf(' '))

    return text + ellipsis;
}

export const clampFilename = (filename: string, maxLength: number = 30): string => {
    if(!filename || filename.length <= maxLength)
        return filename;

    const extIdx = filename.lastIndexOf('.');
    const ext = extIdx < 0 ? '' : filename.substring(extIdx);
    const base = extIdx < 0 ? filename : filename.substring(0, extIdx);
    const fname = clampText(base, maxLength - ext.length, '[...]');

    return fname + ext;
}

export const formatName = (t: string): string => {
    t = t.replace(/\s+/gi, '-')
    .replace(/^\W+/, '')
    .replace(/([^\w-])+/gi, '')
    .replace(/\-+/g, '-');

    return t.trim().toLocaleLowerCase();
}