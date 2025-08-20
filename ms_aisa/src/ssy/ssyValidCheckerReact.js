// enf
export const isEmpty = (txt) => txt === "";

export const lessThan = (txt, len) => txt.length < len;

export const containsHS = (txt) => {
    const set =
        "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-_@.";
    for (let i = 0; i < txt.length; i++) {
        if (set.indexOf(txt[i]) === -1) {
            return true;
        }
    }
    return false;
};

export const notEqual = (txt1, txt2) => txt1 !== txt2;

export const notContains = (txt, set) => {
    for (let i = 0; i < set.length; i++) {
        if (txt.indexOf(set[i]) !== -1) {
            return false;
        }
    }
    return true;
};

export const isNotNum = (txt) => isNaN(txt) || txt.indexOf(" ") !== -1;

export const isNotType = (file, type) => {
    type = "." + type;
    return file.name.toLowerCase().indexOf(type) === -1;
};
