export class SlashCommandBuilder {

    static #DefaultOptionsTypes = ["CHAT_INPUT", "USER", "MESSAGE"];
    static #DefaultCommandTypes = ["SUB_COMMAND", "SUB_COMMAND_GROUP", "STRING", "INTEGER", "BOOLEAN", "USER", "CHANNEL", "ROLE", "MENTIONABLE", "NUMBER"];

    constructor(Client, Commands) {
        this.client = Client;
        this.commands = Commands;
    };

    create(Commands) {
        this.commands = Commands ? Commands : this.commands;
        if (!this.commands) throw new Error("No Commands have been Passed to Slash Command Handler!");
        var count = 0;
        const CookedCommands = [];
        for (count = 0; count < Commands.length; count++) {
            CookedCommands.push(this.#CommandPlacement(CookedData[0]));
        };
        return CookedCommands;
    };

    #CommandPlacement(Command) {
        if (!Command) throw SyntaxError(`No Application Command Credentials is Detected!`);
        var CookedCommand = {};
        var count = 0;
        if (Command.name && typeof Command.name === 'string') CookedCommand.name = Command.name;
        else throw SyntaxError(`Invalid Application Command Name is Detected!`);
        if (Command.description && (typeof Command.description === 'string' || typeof Command.description === 'number')) CookedCommand.description = Command.description;
        else throw SyntaxError(`Invalid Application Command Description is Detected!`);
        if (Command.type && typeof Command.type === 'string' && this.#ChannelTypePlacement(Command.type)) CookedCommand.type = this.#ChannelTypePlacement(Command.type);
        else if (Command.type) throw SyntaxError(`Invalid Application Command Type is Detected!`);
        if (Command.defaultPermission === false || Command.defaultPermission === true) CookedCommand.defaultPermission = Command.defaultPermission;
        else throw SyntaxError(`Invalid Application Command Default-Permission is Detected!`);
        if (Command.options && Command.options.length > 0) {
            CookedCommand.options = [];
            for (count = 0; count < Command.options.length; ++count) {
                CookedCommand.options.push(this.#OptionsPlacement(Command.options[count]));
            };
        };
    };

    #OptionTypePlacement(Type) {
        if (!Type) throw SyntaxError(`No Application Command Type Credential is Detected!`);
        var count = 0;
        for (count = 0; count < SlashCommandBuilder.#DefaultOptionsTypes.length; ++count) {
            if (SlashCommandBuilder.#DefaultOptionsTypes[count].toLowerCase().trim() === Type.toLowerCase().trim()) return SlashCommandBuilder.#DefaultOptionsTypes[count];
        };
        return void null;
    };

    #ChannelTypePlacement(Type) {
        if (!Type) throw SyntaxError(`No Application Command Type Credential is Detected!`);
        var count = 0;
        for (count = 0; count < SlashCommandBuilder.#DefaultCommandTypes.length; ++count) {
            if (SlashCommandBuilder.#DefaultCommandTypes[count].toLowerCase().trim() === Type.toLowerCase().trim()) return SlashCommandBuilder.#DefaultCommandTypes[count];
        };
        return void null;
    };

    #OptionsPlacement(Option) {
        if (!Option) throw SyntaxError(`No Application Command Options Credentials is Detected!`);
        var CookedOptions = {};
        var count = 0;
        if (Option.name && typeof Option.name === 'string') CookedOptions.name = Option.name;
        else throw SyntaxError(`Invalid Application Command Option Name is Detected!`);
        if (Option.description && (typeof Option.description === 'string' || typeof Option.description === 'number')) CookedOptions.description = Option.description;
        else throw SyntaxError(`Invalid Application Command Option Description is Detected!`);
        if (Option.type && typeof Option.type === 'string' && this.#OptionTypePlacement(Option.type)) CookedOptions.type = this.#OptionTypePlacement(Option.type);
        else throw SyntaxError(`Invalid Application Command Type is Detected!`);
        if (Option.defaultPermission === false || Option.defaultPermission === true) CookedOptions.defaultPermission = Option.defaultPermission;
        else throw SyntaxError(`Invalid Application Command Option Default-Permission is Detected!`);
        if (Option.required === false || Option.required === true) CookedOptions.required = Option.required;
        else throw SyntaxError(`Invalid Application Command Option required? is Detected!`);
        if (Option.options && Option.options.length > 0) {
            CookedOptions.options = [];
            for (count = 0; count < Option.options.length; ++count) {
                CookedOptions.options.push(this.#OptionsPlacement(Option.options[count]));
            };
        };
        if (Option.choices && Option.choices.length > 0) {
            CookedOptions.choices = [];
            for (count = 0; count < Option.choices.length; ++count) {
                CookedOptions.choices.push(this.#ChoicesPlacement(Option.choices[count]));
            };
        };
    };


    #ChoicesPlacement(Choice) {
        if (!Choice) throw SyntaxError(`No Application Command Options Credentials is Detected!`);
        var CookedChoices = {};
        if (Choice.name && typeof Choice.name === 'string') CookedChoices.name = Choice.name;
        else throw SyntaxError(`Invalid Application Command Choice Name is Detected!`);
        if (Choice.value) CookedChoices.value = Choice.value;
        else throw SyntaxError(`Invalid Application Command Choice Value is Detected!`);
    };
};