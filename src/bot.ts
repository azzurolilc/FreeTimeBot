// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// import * as axios from 'axios';
import { ActivityHandler } from 'botbuilder';
import { get, post } from 'request-promise';
export class MyBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const text = context.activity.text;
            const messageDefault = 'Please choose from "activity", "name", "echo".';
            const endpointSecure = 'https://freetimehttpstest.westus2.azurecontainer.io/getallevents';
            const endpoint = 'http://freetime.westus2.azurecontainer.io:8080/getallevents';

            const postEndpoint = 'http://freetime.westus2.azurecontainer.io:8080/signup';

            switch (text) {
                case 'activity': {
                    console.log('you choose activity');
                    const options = {
                        uri: endpoint,
                    };
                    await get(options).then((body) => {
                        console.log(body);
                        context.sendActivity(body);
                    }).catch((_) => {
                        console.log(_);
                        context.sendActivity(_);
                    });
                    await context.sendActivity(messageDefault);
                    break;
                }
                case 'name': {
                    const name = context.activity.from.name;
                    const options = {
                        body: {
                            username: name,
                        },
                        json: true,
                        uri: postEndpoint,
                    };
                    await context.sendActivity(`Your name is '${name}'`);
                    await post(options);
                    await context.sendActivity(messageDefault);
                    break;
                }
                default: {
                    await context.sendActivity(`You said '${context.activity.text}'`);
                    await context.sendActivity(messageDefault);
                    break;
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
