import contenttype from 'content-type';

export const setCharset = function setCharset(type?: string, charset?: string) {
    if (!type || !charset) {
        return type;
    }
    var parsed = contenttype.parse(type);
    parsed.parameters.charset = charset;
    return contenttype.format(parsed);
};

export default {
    setCharset
};
