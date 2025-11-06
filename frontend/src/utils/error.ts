export class CustomError extends Error {
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}

// export function catchErrors<T, E extends new (message?: string) => Error>(promise: Promise<T>, errorsToCatch?: E[]): Promise<[undefined | T] | [InstanceType<E>]> {
//     return promise
//         .then(data => {
//             return [undefined, data] as [undefined, T];
//         })
//         .catch(err => {
//             if (errorsToCatch == undefined) {
//                 return [err];
//             }
//             const error = err as InstanceType<E>;
//             if (errorsToCatch.some((e) => err instanceof e)) {
//                 return [error];
//             }
//             throw err;
//         });
// }

export function getError(error: unknown): CustomError {
    if (error instanceof SyntaxError) {
        console.log("error");
        return new CustomError("Syntax Error", "An error has occured")
    }
    if (error instanceof CustomError) {
        return error;
    }
    let message: string;
    if (error instanceof Error) {
        message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
    } else if (typeof error === 'string') {
        message = error;
    } else message = 'An unknown error has occured';
    return new CustomError("Unknown Error", message);
}

