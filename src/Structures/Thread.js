/**
 * @class ThreadBuilder is the Class to Operate Particular Threads in Same Channel Respective Server
 * @constructor Constructing Unique Instances for Each Channel
 * @param {*} Options Options Values for Particular Channel Instance
 * @returns {*} A Class Instance of Single Channel [ Unique Instance ]
 */

export class ThreadBuilder {

    /**
     * @property {Number} InstanceNumber : For Storing Instance Numbers for further Utils Requirements
     */

    static InstanceNumber = 0;

    /**
     * @property {Array} ThreadsInstanceRecords : For Storing Thread Instances for further Utils Requirements
     */

    static #ThreadsInstanceRecords = [];

    constructor(Options) {
        this.Client = Options.Client;
        this.ChannelInstance = Options.InstanceNumber;
        this.ThreadInstances = 0;
        this.Guild = Options.Guild;
        this.Channel = Options.Channel;
    };

    /**
     * @method CreateInstance Method for Creating Instance for the particular Channel
     * @param {*} Options Options for Name , AutoArchive Duration , Reason , Type
     */

    async CreateInstance(Options) {
        if (!Options) throw TypeError(`Invalid Options Detected for Thread Creator`);
        else if (Options.Type && !['private', 'public'].includes(`${Options.Type.toLowerCase().trim()}`)) throw TypeError(`Invalid Thread Type is Detected!`);
        const ThreadData = await this.Channel.threads.create({
            name: Options.Name ? Options.Name : `Thread Instance - ${this.ThreadInstances + 1} | Jericho Framework`,
            autoArchiveDuration: Options.AutoArchiveDuration ? Options.AutoArchiveDuration : 60,
            type: Options.Type === 'private' ? 'private_thread' : `public_thread`,
            reason: Options.Reason ? Options.Reason : `Thread Created by ${this.Client.user.name} on Thread Handler | Jericho Framework`,
        }).catch(error => {
            throw error;
        });
        this.ThreadInstances += 1;
        const ReturningValue = {
            ThreadInstance: this.ThreadInstances,
            Thread: ThreadData,
            CreationOptions: Options
        };
        ThreadBuilder.#ThreadsInstanceRecords.push(ReturningValue);
        this.ThreadInstance.Library.push(ReturningValue);
        return ReturningValue;
    };

    /**
     * @method DestroyInstance Destroy Particular Instance Completely from Thread Class
     * @param {Number} Instance ThreadInstance of a Channel's message
     * @param {*} Options Options for Delay Destroy 
     */

    DestroyInstance(Instance, Options) {
        const Thread = ThreadBuilder.#fetchthreadInstances([Instance])[0].Thread;
        if (!Options) throw SyntaxError(`Options Variable can't be Undefined , Reason is Compulsory`);
        if (Options.Delay && !isNaN(Options.Delay) && Options.Reason) return setTimeout(ThreadDeletion(Thread, Options.Reason, Instance), parseInt(Options.Delay) * 1000);
        else if (Options.Reason) return ThreadDeletion(Thread, Options.Reason, Instance);
        else throw SyntaxError(`Options Variable can't be Undefined , Reason is Compulsory`);

        function ThreadDeletion(Thread, Reason, Instance) {
            return Thread.delete(`${Reason ? Reason : `Deleted Thread Instance - ${Instance}`}`).then(() => {
                return void ThreadBuilder.#removethreadsInstances([Instance]);
            }).catch(error => {
                throw error;
            });
        };
    };

    /**
     * @method GetInstances Get Thread Instance from the Thread Structure Class
     * @param {*} Instances ThreadInstance of a Channel's message
     * @param {Boolean} ExtraFetch Client should fetch More Deep Data ?
     */

    GetInstances(Instances, Amount, ExtraFetch) {
        var FilteredData = {
            Thread: ThreadBuilder.#fetchthreadInstances([Instances], Amount).Thread,
            CreationOptions: undefined,
            TotalServerThreadsCount: undefined,
        };
        if (ExtraFetch) {
            FilteredData = {
                CreationOptions: ThreadBuilder.#fetchthreadInstances([Instances], Amount).CreationOptions,
                TotalServerThreadsCount: ThreadBuilder.#ThreadsInstanceRecords.length,
            };
        };
        return FilteredData;
    };

    /**
     * @private {method} #fetchthreadInstances : Fetching thread Instance from the Thread Builder Class
     * @param {*} Instance Thread Instance from Thread Builder Class
     * @returns undefined Value
     */

    static #fetchthreadInstances(Instance, Amount) {
        var count = 0;
        const ThreadRecords = ThreadBuilder.#ThreadsInstanceRecords;
        var ThreadInstance = [];
        if (Amount && Amount.toLowerCase().trim() === `all`) Amount = ThreadRecords.length;
        else Amount = null;
        for (count = 0; count < ThreadRecords.length; ++count) {
            if (Instance.length >= 2) ThreadInstance.push(ThreadRecords[count]);
            else if (Amount && count === parseInt(Amount) - 1) return ThreadInstance;
            else if (ThreadRecords[count].ThreadInstance === Instance) ThreadInstance.push(ThreadRecords[count]);
        };
        return void null;
    };

    /**
     * @private {method} #removethreadsInstances : Removing Thread Instances from the Thread Builder Class
     * @param {*} Instances Array of Instances to Remove from the Cache - Thread Builder Caches
     * @returns undefined value
     */

    static #removethreadsInstances(Instances) {
        var count = 0;
        var count_instance = 0;
        const ThreadRecords = ThreadBuilder.#ThreadsInstanceRecords;
        for (count = 0; count < ThreadRecords.length; ++count) {
            for (count_instance = 0; count_instance < Instances.length; ++count_instance) {
                if (ThreadRecords[count].ThreadInstance === Instances[count_instance]) RemoveInstances(count);
            };
        };
        return void null;

        function RemoveInstances(Position) {
            ThreadBuilder.#ThreadsInstanceRecords[Position] = null;
            return void null;
        };
    };
}