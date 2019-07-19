"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
class MyBot extends botbuilder_1.ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            yield context.sendActivity(`You said '${context.activity.text}'`);
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    yield context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
    }
}
exports.MyBot = MyBot;
//# sourceMappingURL=bot.js.map