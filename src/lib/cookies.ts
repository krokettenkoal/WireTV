/**
 * Sets a cookie for the client.
 * @param name Name of the cookie to be set
 * @param value Value of the cookie
 * @param days (optional) Days from now the cookie will expire in
 */
export const createCookie = (name: string, value: any, days: number | undefined = undefined): string => {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }

    return `${name}=${value || ''}${expires}; path=/`;
}

/**
 * Gets the value of a cookie.
 * @param name Name of the cookie get the value for
 * @returns The value of the cookie, or null if not found.
 */
export const readCookie = (cookie: string, name: string): string | null => {
    let nameEq = name + "=";
    let parts = cookie.split(';');
    
    for(let i = 0; i < parts.length; i++) {
        let c = parts[i];

        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        
        if (c.indexOf(nameEq) == 0)
            return c.substring(nameEq.length, c.length);
    }

    return null;
}

/**
 * Erases/deletes a cookie from the client.
 * @param name Name of the cookie to erase
 */
export const createEraseCookie = (name: string): string => {   
    return name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}