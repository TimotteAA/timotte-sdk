export const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
export const formatURL = (host, path, fallbackURL) => {
    const url = host.endsWith('/') || path.startsWith('/') ? `${host}${path}` : `${host}/${path}`;
    if (isValidURL(url)) {
        return url;
    }
    else {
        return fallbackURL;
    }
};
//# sourceMappingURL=url.js.map