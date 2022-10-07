// Copyright 2016-2021, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as service from "@pulumi/pulumiservice";

export interface TeamPermissionArgs {
    organization?: string;
    project?: string;
    stack?: string;
    team: string;
    permissionScope: string;
}

export class TeamPermission extends pulumi.ComponentResource {

    constructor(name: string, args: TeamPermissionArgs, opts?: pulumi.ComponentResourceOptions) {
        super("team-stack-permission:index:TeamPermission", name, args, opts);

        let permission: service.TeamStackPermissionScope;
        switch (args.permissionScope.toLocaleLowerCase()) {
            case "admin":
                permission = service.TeamStackPermissionScope.Admin;
                break;
            case "edit":
                permission = service.TeamStackPermissionScope.Edit;
                break;
            case "read":
                permission = service.TeamStackPermissionScope.Read;
                break;
            default:
                throw new Error("unrecognized permission scope. must either be: admin, edit, read");
        }

        const options = pulumi.mergeOptions(opts, { parent: this });
        new service.TeamStackPermission(name, {
            organization: args.organization ? args.organization : pulumi.getOrganization(),
            project: args.project ? args.project : pulumi.getProject(),
            stack: args.stack ? args.stack : pulumi.getStack(),
            team: args.team,
            permission: permission
        }, options);
    }
}
