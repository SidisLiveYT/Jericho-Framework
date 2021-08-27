import {
    ChannnelResolver
} from '../Utilities/Resolver_Utils.js';
import {
    ThreadBuilder
} from '../Structures/Thread.js';

/**
 * @param {*} Client Discord API Client from discord.js v13
 * @param {*} Option Default Options for Thread ThreadHandler
 */

class ThreadHandler {
    constructor(Client, Options) {
        this.Client = Client;
        this.Options = Options;
    };

    static #ChannelInstanceRecords = [];

    /**
     * @method GetNormalThread Get Thread information of Particular Channel or Message
     * @param {*} ChannelResolve Thread Channel or Discord Message variable
     */

    GetNormalThread(ChannelResolve) {
        const ThreadChannel = ChannnelResolver(this.Client, ChannelResolve, {
            type: `thread`,
            ifmessage: true
        });
        return ThreadChannel;
    };

    /**
     * @method GetThreadInstances Get Instance information of Particular Channel or Message
     * @param {*} ChannelResolve Thread Channel or Discord Message variable
     * @param {Boolean} ExtraFetch Client should Fetch Extra Value from Thread Builder Class ?
     */

    GetThreadInstances(ChannelResolve, Amount, ExtraFetch) {
        const MainChannel = ChannnelResolver(this.Client, ChannelResolve, {
            type: `text`,
            ifmessage: true
        });
        if (!ThreadHandler.#CheckInstance(MainChannel)) return void null;
        else {
            const ChannelInstance = ThreadHandler.#CheckInstance(MainChannel);
            var Thread = ChannelInstance.GetInstances(MainChannel, Amount, ExtraFetch);
            return Thread;
        };
    };

    /**
     * @method CreateThread Create Method method of the Class
     * @param {*} ChannelResolve Thread Channel or Discord Message variable
     * @param {*} CreateOptions Options to create Thread for Particular Server and Channel
     */

    CreateThread(ChannelResolve, CreateOptions) {
        const MainChannel = ChannnelResolver(this.Client, ChannelResolve, {
            type: `text`,
            ifmessage: false
        });
        if (ThreadHandler.#CheckInstance(MainChannel)) {
            const ChannelInstance = ThreadHandler.#CheckInstance(MainChannel);
            var Thread = ChannelInstance.CreateInstance(CreateOptions);
            return Thread;
        } else {
            ThreadBuilder.InstanceNumber = ThreadBuilder.InstanceNumber + 1;
            const ChannelInstance = ThreadBuilder({
                Client: this.Client,
                Instance: ThreadBuilder.InstanceNumber,
                GuildID: MainChannel.Guild,
                ChannelID: MainChannel,
            });
            ThreadHandler.#ChannelInstanceRecords.push(ChannelInstance);
            var Thread = ChannelInstance.CreateInstance(CreateOptions);
            return Thread;
        };
    };

    DestroyThread(ChannelResolve) {
        const MainChannel = ChannnelResolver(this.Client, ChannelResolve, {
            type: `text`,
            ifmessage: true
        });
        if (!ThreadHandler.#CheckInstance(MainChannel)) return void null;
        else {
            const ChannelInstance = ThreadHandler.#CheckInstance(MainChannel);
            var Thread = ChannelInstance.GetInstances(MainChannel, Amount, ExtraFetch);
            return Thread;
        };
    };

    /**
     * @method #CheckInstance Private Method to Check Wheather Channel exist as Instance for Threads
     * @param {*} Channel Channel for the Unique Instance Extractor
     * @returns {*} ChannelInstance
     */

    static #CheckInstance(Channel) {
        var count = 0;
        const ChannelRecords = ThreadHandler.#ChannelInstanceRecords;
        for (count = 0; count < ChannelRecords.length; ++count) {
            if (`${ChannelRecords[count].Channel.id}` === `${Channel.id}`) return ChannelRecords[count];
        };
        return void null;
    };
};