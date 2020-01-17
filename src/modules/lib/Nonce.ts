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

import { NONCE_CHARACTER_SET, NONCE_LENGTH } from "../../constants";


export default class Nonce {

    public static generate = (): string => {
        let nonce = "";

        for (let i = 0; i < NONCE_LENGTH; i++) {
            nonce += NONCE_CHARACTER_SET.charAt(Math.floor(Math.random() * NONCE_CHARACTER_SET.length));
        }
        return nonce;
    }
}