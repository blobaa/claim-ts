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

import { ClaimObject, CreateClaimParams, Hashes, IClaim, PrepareUserDataParams, SetUserDataParams, UserData, VerifyClaimParams } from "../../types";
import ClaimController from "./controllers/ClaimController";
import ClaimService from "./services/ClaimService";


export default class ClaimHandler implements IClaim {

    private claimController = new ClaimController(new ClaimService());


    public prepareUserData(params: PrepareUserDataParams): UserData[] {
        return this.claimController.prepareUserData(params);
    }


    public setUserData(params: SetUserDataParams): void {
        this.claimController.setUserData(params);
    }


    public createHashes(): Hashes {
        return this.claimController.createHashes();
    }


    public createClaim(params: CreateClaimParams): ClaimObject {
        return this.claimController.createClaim(params);
    }


    public verifyClaim(params: VerifyClaimParams): boolean {
        return this.claimController.verifyClaim(params);
    }

}