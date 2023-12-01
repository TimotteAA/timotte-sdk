export const isValidURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const formatURL = (host: string, path: string, fallbackURL?: string) => {
    // 确保host和path以适当的方式组合
    const url = host.endsWith('/') || path.startsWith('/') ? `${host}${path}` : `${host}/${path}`;

    // 检查URL是否有效
    if (isValidURL(url)) {
        return url;
    } else {
        // 如果无效，返回备选URL
        return fallbackURL;
    }
};
