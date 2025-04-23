export function createPostParameters(params: Object): string {
    return Object.keys(params)
        .flatMap((key) => ((params as any)[key]===null || (params as any)[key] === "") ? [] : [`${key}=${(params as any) [key]}`])
        .join('&');
}

export function basePrefix(url: string) {
    return `/~chenp102/team/${url}`;
}
