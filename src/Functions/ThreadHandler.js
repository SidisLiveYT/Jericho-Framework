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

    static #ChannelInstancesNumber = 0;
    static #ThreadInstanceRecords = {};

    constructor(Client, Options) {
        this.Client = Client;
        this.ChannelInstance = ++ThreadHandler.#ChannelInstancesNumber;
        this.guild = GuildResolver(this.Client, Options.guild, {
            ifmessage: true
        });
        this.channel = ChannnelResolver(this.Client, Options.channel, {
            type: `text`,
            ifmessage: true
        });
        this.metadata = Options.metadata;
    };

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
     */

    GetThreadInstances(Instance, Amount) {
        const ThreadInstances = ThreadHandler.#CheckInstance(this.channel);
        if (ThreadInstances && ThreadInstances.length > 0) {
            var Thread = ThreadHandler.#GetInstance(ThreadInstances, Amount, Instance);
            return Thread;
        } else return void null;
    };

    /**
     * @method CreateThread Create Method method of the Class
     * @param {*} Options Options to create Thread for Particular Server and Channel
     */

    CreateThread(Options) {
        const ThreadInstanceClass = new ThreadBuilder({
            Client: this.Client,
            guild: this.guild,
            channel: this.channel,
            metadata: Options ? Options.metadata : this.metadata,
        });
        const ThreadInstance = ThreadInstanceClass.create(Options);
        var ThreadInstances = ThreadHandler.#ThreadInstanceRecords[`'${this.ChannelInstance}'`];
        if (ThreadInstances) ThreadInstances.push(ThreadInstance);
        else ThreadInstances = [ThreadInstance];
        ThreadHandler.#ThreadInstanceRecords[`'${this.ChannelInstance}'`] = ThreadInstances;
        return ThreadInstance;
    };

    async DestroyThread(ThreadInstance, Options) {
        var ThreadInstances = ThreadHandler.#CheckInstance(this.channel);
        if (ThreadInstances && ThreadInstances.length > 0) {
            var Thread = ThreadHandler.#GetInstance(ThreadInstances, 1, ThreadInstance);
            const Success = await Thread.destroy(Options);
            if (Success) return ThreadHandler.#RemoveInstance(ThreadInstances, ThreadInstance);
            else return void null;
        } else return void null;
    };

    /**
     * @method #CheckInstance Private Method to Check Wheather Channel exist as Instance for Threads
     * @param {*} Channel Channel for the Unique Instance Extractor
     * @returns {*} ChannelInstance
     */

    static #CheckInstance(ChannelInstance) {
        const ThreadInstances = ThreadHandler.#ThreadInstanceRecords[`'${ChannelInstance}'`];
        return ThreadInstances;
    };

    static #RemoveInstance(ThreadInstances, Instance) {
        var count = 0;
        for (count = 0; count < ThreadInstances.length; ++count) {
            if (ThreadInstances[count].ThreadInstance === Instance) ThreadInstances[count] = undefined;
        };
        ThreadHandler.#ThreadInstanceRecords[`'${ChannelInstance}'`] = ThreadInstances;
        return ThreadInstances;
    };

    static #GetInstance(ThreadInstances, Amount, Instance) {
        var count = 0;
        var Threads = [];
        if (Instance && Instance.toLowerCase().trim() === 'all') return ThreadInstances;
        for (count = 0; count < ThreadInstances.length; ++count) {
            if (ThreadInstances[count].ThreadInstance === Instance) Threads.push(ThreadInstances[count]);
            if (Amount && count === Amount) break;
        };
        return Threads;
    };
};