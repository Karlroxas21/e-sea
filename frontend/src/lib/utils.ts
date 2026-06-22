import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as z from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const safeString = (fieldName: string) => 
    z.string()
        .trim()
        .min(3, `${fieldName} is required`)
        .regex(/^[^<>]*$/, { message: 'HTML tags are not allowed' })
        .regex(new RegExp("^(?!.*(--|;|/\\\\*|\\\\*/)).*$"), { message: 'Invalid characters detected' });
