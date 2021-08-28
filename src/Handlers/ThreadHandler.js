import {
    ChannnelResolver,
    GuildResolver
} from '../Utilities/Resolver_Utils.js';
import {
    ThreadBuilder
} from '../Structures/Thread.js';

/**
 * @param {*} Client Discord API Client from discord.js v13
 * @param {*} Options Default Options for Thread ThreadHandler
 */

export class ThreadHandler {

    static #ChannelInstancesNumber = 0;
    static #ThreadInstanceRecords = {};

    constructor(Client, Options) {
        this.Client = Client;
        this.ChannelCode = ++ThreadHandler.#ChannelInstancesNumber;
        this.guild = GuildResolver(Client, Options.guild, {
            ifmessage: true
        });
        this.channel = ChannnelResolver(Client, Options.channel, {
            type: `text`,
            ifmessage: true
        });
        this.metadata = Options.metadata;
        ThreadHandler.#ThreadInstanceRecords[`'${ThreadHandler.#ChannelInstancesNumber}'`] = [];
    };

    /**
     * @method GetNormalThread Get Thread information of Particular Channel or Message
     * @param {*} ChannelResolve Thread Channel or Discord Message variable
     */

    GetThread(ChannelResolve) {
        const ThreadChannel = ChannnelResolver(this.Client, ChannelResolve, {
            type: `thread`,
            ifmessage: true
        });
        return ThreadChannel;
    };

    /**
     * @method GetThreadInstances Get Instance information of Particular Channel or Message
     * @param {Number} Instance Thread Channel or Discord Message variable
     * @param {Number} Amount Amount of Threads want to Recover from the Channel Instance
     */

    GetThreadInstances(Instance, Amount) {
        const ThreadInstances = ThreadHandler.#CheckInstance(this.ChannelCode);
        if (ThreadInstances && ThreadInstances.length > 0) {
            var Thread = ThreadHandler.#GetInstance(ThreadInstances, Amount, Instance);
            return Thread;
        } else return void null;
    };

    /**
     * @method CreateThread Create Method method of the Channel Class
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
        var ThreadInstances = ThreadHandler.#ThreadInstanceRecords[`'${this.ChannelCode}'`];
        if (ThreadInstances) ThreadInstances.push(ThreadInstance);
        else ThreadInstances = [ThreadInstance];
        ThreadHandler.#ThreadInstanceRecords[`'${this.ChannelCode}'`] = ThreadInstances;
        return ThreadInstance;
    };

    /**
     * @method DestroyThread Destroying Thread from Cache and Thread Instances
     * @param {*} ThreadInstance Unique Thread Instance for the Deletion
     * @param {*} Options Options for Reason or Delay in Deletion
     * @returns {Boolean} Boolean true on Success or undefined on faliure
     */

    async DestroyThread(ThreadInstance, Options) {
        var ThreadInstances = ThreadHandler.#CheckInstance(this.ChannelCode);
        if (ThreadInstances && ThreadInstances.length > 0) {
            var Thread = ThreadHandler.#GetInstance(ThreadInstances, 1, ThreadInstance);
            const Success = await Thread.destroy(Options);
            if (Success) return ThreadHandler.#RemoveInstance(ThreadInstances, ThreadInstance, this.ChannelCode);
            else return void null;
        } else return void null;
    };

    /**
     * @method #CheckInstance Private Method to Check Wheather Channel exist as Instance for Threads
     * @param {Number} ChannelCode Channel Instance Code present on Class Cache
     * @returns {*} ThreadsInstances
     */

    static #CheckInstance(ChannelCode) {
        const ThreadInstances = ThreadHandler.#ThreadInstanceRecords[`'${ChannelCode}'`];
        return ThreadInstances;
    };

    /**
     * @method #RemoveInstance private Method for Deletion of Thread Instance from the Class Cache
     * @param {*} ThreadInstances Array  of Thread Instances for Deletion from Cache
     * @param {Number} Instance if its not all , then Number of Instance to delete
     * @param {Number} ChannelCode Channel Instance Code present on Class Cache 
     * @returns {Boolean} True or False Depends
     */

    static #RemoveInstance(ThreadInstances, Instance, ChannelCode) {
        var count = 0;
        for (count = 0; count < ThreadInstances.length; ++count) {
            if (ThreadInstances[count].ThreadInstance === Instance) {
                ThreadInstances[count] = undefined;
                break;
            };
        };
        ThreadHandler.#ThreadInstanceRecords[`'${ChannelCode}'`] = ThreadInstances;
        return true;
    };

    /**
     * @method #GetInstance Private Static Method to get Thread Instance from the Cache
     * @param {*} ThreadInstances Array of Thread Instances (Cache Value) 
     * @param {Number} Amount Amount of Instances fetch if not Instance mentioned
     * @param {Number} Instance Exact Number of Thread Instance to Fetch
     * @returns 
     */
    static #GetInstance(ThreadInstances, Amount, Instance) {
        var count = 0;
        var Threads = [];
        if (Instance && Instance.toLowerCase().trim() === 'all') return ThreadInstances;
        for (count = 0; count < ThreadInstances.length; ++count) {
            if (Instance && ThreadInstances[count].ThreadInstance === Instance) Threads.push(ThreadInstances[count]);
            else if (!Instance) Threads.push(ThreadInstances[count]);
            if (Amount && count === Amount) break;
        };
        return Threads;
    };
};