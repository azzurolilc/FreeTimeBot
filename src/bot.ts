// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AdaptiveCards from 'adaptivecards';
import { ActivityHandler, CardFactory, MessageFactory } from 'botbuilder';
import * as _ from 'lodash';
import { get, post } from 'request-promise';
interface IEvent {
    Event: IEventDetail;
    Interests: string[];
}

interface IEventDetail {
    EventID: string;
    Name: string;
    OwnerID: string;
    StartTime: string;
    Location: string;
    ParticipantCount: number;
    Description: string;
}

export class MyBot extends ActivityHandler {
    constructor() {
        super();
        // TODO: This is dangerous,
        // will allow API content to be intercepted and modified between the client and the server.
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        this.onMessage(async (context, next) => {
            const text = context.activity.text;

            const securedGetAll = 'https://ftubuntu.westus2.azurecontainer.io:443/getallevents';
            // const securedCreateUser = 'https://ftubuntu.westus2.azurecontainer.io:443/signup';

            switch (text) {
                case 'Show me activities': {
                    const name = context.activity.from.name;
                    const options = {
                        uri: securedGetAll,
                    };
                    await get(options).then((body) => {
                        console.log(body);
                        _.forEach(JSON.parse(body), async (event: IEvent) => {
                            console.log(event.Event.Name);
                            console.log(event.Event.Location);
                            await this.eventCard(
                                context,
                                event.Event.Name,
                                event.Event.Description,
                                event.Event.EventID);
                        });
                    }).catch((e) => {
                        console.log(e);
                        context.sendActivity(e);
                    });
                    // await this.showOptions(context, name);
                    break;
                }
                case 'login': {
                    await this.loginCard(context);
                    break;
                }
                case 'Join': {
                    // const card = CardFactory.thumbnailCard('Freetime Teams App', 'Welcome to Freetime Teams App. I am here to help you connect with your collegues', ['https://example.com/whiteShirt.jpg'], ['Tell Me More', 'Login, Let\'s Get Started']);
                    // const message = MessageFactory.attachment(card);
                    // await context.sendActivity(message);
                    await this.showOptions(context, context.activity.from.name);
                    break;

                }
                default: {
                    await context.sendActivity(`You said '${context.activity.text}'`);
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
                    await this.loginCard(context);
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
    private async loginCard(context: any) {
        const card = CardFactory.heroCard(
            'Freetime, a Teams app bringing people together to share your passion!',
            ['https://ftubuntu.westus2.azurecontainer.io/profileimages/feaba940-1f0d-4dfa-8fdc-ea27d4ae81b6.jpg'],
            ['Tell Me More', 'Join'],
        );
        await context.sendActivity(MessageFactory.attachment(card));
    }

    private async showOptions(context: any, name: string) {
        const card = CardFactory.thumbnailCard(
            'Freetime',
            'Hi,' + name + '\nChoose from the following options',
            ['https://ftubuntu.westus2.azurecontainer.io/profileimages/feaba940-1f0d-4dfa-8fdc-ea27d4ae81b6.jpg'],
            ['Show me activities', 'My next activity'],
        );
        await context.sendActivity(MessageFactory.attachment(card));
    }

    private async eventCard(context: any,
                            eventName: string,
                            description: string,
                            id: string) {
        const url: string = 'https://ftubuntu.westus2.azurecontainer.io/eventimages/' + id + '.jpg';
        const card = CardFactory.thumbnailCard(
            eventName,
            description,
            [url],
            ['Tentative', 'Participate'],
        );
        await context.sendActivity(MessageFactory.attachment(card));
    }
}
