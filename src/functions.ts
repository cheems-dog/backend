import * as fs from 'fs';
import * as path from 'path';
import * as commentJson from 'comment-json';

export const config = () => {
    return commentJson.parse(fs.readFileSync(path.join(__dirname, '../config.jsonc')).toString())
}