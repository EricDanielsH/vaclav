import { parseStringPromise } from 'xml2js';

export const parseXML = async (xmlText: string) => {
    try {
        const result = await parseStringPromise(xmlText);
        return result;
    } catch (error) {
        console.error("Error parsing the XML: ", error);
        return null;
    }
}