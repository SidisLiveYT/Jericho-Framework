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

    static #ThreadInstanceNumber = 0;

    constructor(Options) {
        this.Client = Options.Client;
        this.ThreadCode = ThreadBuilder.#ThreadInstanceNumber + 1;
        this.channel = Options.channel;
        this.guild = Options.guild;
        this.metadata = Options.metadata;
        this.thread = null;
    };

    /**
     * @method CreateInstance Method for Creating Instance for the particular Channel
     * @param {*} Options Options for Name , AutoArchive Duration , Reason , Type
     */

    async create(Options) {
        if (!Options) throw TypeError(`Invalid Options Detected for Thread Creator`);
        else if (Options.Type && !['private', 'public'].includes(`${Options.Type.toLowerCase().trim()}`)) throw TypeError(`Invalid Thread Type is Detected!`);
        const Thread = await this.channel.threads.create({
            name: Options.Name ? Options.Name : `Thread Instance - ${this.ThreadInstances + 1} | Jericho Framework`,
            autoArchiveDuration: Options.AutoArchiveDuration ? Options.AutoArchiveDuration : 60,
            type: Options.Type === 'private' ? 'GUILD_PRIVATE_THREAD' : `GUILD_PUBLIC_THREAD`,
            reason: Options.Reason ? Options.Reason : `Thread Created by ${this.Client.user.name} on Thread Handler | Jericho Framework`,
        }).catch(error => {
            throw error;
        });
        this.thread = Thread;
        return this;
    };

    /**
     * @method DestroyInstance Destroy Particular Instance Completely from Thread Class
     * @param {*} Options Options for Delay Destroy 
     */

    destroy(Options) {
        if (!Options) throw SyntaxError(`Options Variable can't be Undefined , Reason is Compulsory`);
        if (Options.Delay && !Number.isNaN(Options.Delay) && Options.Reason) return setTimeout(ThreadDeletion(this.thread, Options.Reason), parseInt(Options.Delay) * 1000);
        else if (Options.Reason) return ThreadDeletion(this.thread, Options.Reason);
        else throw SyntaxError(`Options Variable can't be Undefined , Reason is Compulsory`);

        function ThreadDeletion(Thread, Reason) {
            return Thread.delete(`${Reason ? Reason : `Deleted Thread Instance}`}`).then(() => {
                return true;
            }).catch(error => {
                throw error;
            });
        };
    };
}