import { objectAny, atomicObject } from "../../types"



export default class Helpers {

    public static concatObjectValues = (object: atomicObject): string => {
        let concatString = "";
        let addSeparator = false;
        
        Helpers.sortObjectKeysAlphanumeric(object, (key) => {
            if (!addSeparator) addSeparator = true;
            else concatString += "+";
            
            concatString += object[key];
        });
        
        return concatString;
    }

    private static sortObjectKeysAlphanumeric = (object: objectAny, callback: (key: string) => void): void => {
        Object.keys(object).sort().forEach((key) => callback(key));
    }


    public static concatArrayElements = (array: string[]) => {
        let concatString = "";
        let addSeparator = false;
    
        Helpers.sortArrayElementsAlphanumeric(array, (element) => {
            if (!addSeparator) addSeparator = true;
            else concatString += "+";
    
            concatString += element;
        });
    
        return concatString;
    }
    
    private static sortArrayElementsAlphanumeric = (array: string[], callback: (element: string) => void) => {
        array.sort().forEach((element) => callback(element));
    }
    


    public static deepCopy = (object: objectAny): objectAny => {
        return JSON.parse(JSON.stringify(object));
    }


    public static parseDataContainer = (object: objectAny, callback: (container: objectAny, atomicObject: atomicObject, info: { parentType: string, path: string }) => void): void => {
        Helpers.parseObject(object, { parentType: 'object', path: '.' }, callback);
    }

    private static parseObject = (object: objectAny, info: { parentType: string, path: string }, callback: (container: objectAny, atomicObject: atomicObject, info: { parentType: string, path: string }) => void) => {
        let atomicObject: atomicObject = {};

        for (let key in object) {
            if(Helpers.isObjectType(object[key])) Helpers.parseObject(object[key], { parentType: 'object', path: info.path + "/" + key }, callback);
            else atomicObject[key] = object[key];
        }

        if(!Helpers.isObjectEmpty(atomicObject)) callback(object, atomicObject, info);
    }

    private static isObjectType = (variable: any): boolean => {
        return typeof variable === 'object';
    }

    private static isObjectEmpty = (object: objectAny): boolean => {
        for(var key in object) if (object.hasOwnProperty(key)) return false;
        return true;
    }
}