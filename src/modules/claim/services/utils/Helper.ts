/*
 *  Copyright (C) 2020  Attila Aldemir <a_aldemir@hotmail.de>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { objectAny, atomicObject } from "../../../internal-types";


export default class Helper {

    public static concatObjectValues(object: atomicObject): string {
        let concatString = "";
        Helper.sortObjectKeysAlphanumeric(object, key => concatString += object[key]);
        return concatString;
    }

    private static sortObjectKeysAlphanumeric(object: objectAny, callback: (key: string) => void): void {
        Object.keys(object).sort().forEach(key => callback(key));
    }


    public static concatArrayElements(array: string[]): string {
        let concatString = "";
        Helper.sortArrayElementsAlphanumeric(array, element => concatString += element);
        return concatString;
    }

    private static sortArrayElementsAlphanumeric(array: string[], callback: (element: string) => void): void {
        array.sort().forEach(element => callback(element));
    }

}