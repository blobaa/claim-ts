import { objectAny, atomicObject } from "../../types"



export default class Helpers {

    public static concatObjectValues = (object: atomicObject): string => {
        let concatString = "";
        Helpers.sortObjectKeysAlphanumeric(object, key => concatString += object[key]);
        return concatString;
    }

    private static sortObjectKeysAlphanumeric = (object: objectAny, callback: (key: string) => void): void => {
        Object.keys(object).sort().forEach(key => callback(key));
    }


    public static concatArrayElements = (array: string[]) => {
        let concatString = "";
        Helpers.sortArrayElementsAlphanumeric(array, element => concatString += element);
        return concatString;
    }
    
    private static sortArrayElementsAlphanumeric = (array: string[], callback: (element: string) => void) => {
        array.sort().forEach((element) => callback(element));
    }
    
}