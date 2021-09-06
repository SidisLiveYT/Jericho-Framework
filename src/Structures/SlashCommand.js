const { Client } = require('discord.js')

/**
 * @class SlashCommandBuilder - Build a Slash Commands Strucutre for Interaction
 * @param {Collection} Client Discord API Client with respect to discord.js v13
 * @param {Array} Commands Arrays of Commands for Slash Command Interaction .
 */

module.exports = class SlashCommandBuilder {
  /**
   * @property {Array} DefaultOptionsTypes Array of Option type for Slash Command Interactions.
   */

  static #DefaultOptionsTypes = ['CHAT_INPUT', 'USER', 'MESSAGE']

  /**
   * @property {Array} DefaultCommandTypes Array of Command type for Slash Command Interactions.
   */

  static #DefaultCommandTypes = [
    'SUB_COMMAND',
    'SUB_COMMAND_GROUP',
    'STRING',
    'INTEGER',
    'BOOLEAN',
    'USER',
    'CHANNEL',
    'ROLE',
    'MENTIONABLE',
    'NUMBER',
  ]

  /**
   * @constructor Construct Class SlashCommandBuilder
   * @param {Client} Client Discord API Client with respect to discord.js v13
   * @param {Array} commands Arrays of Commands for Slash Command Interaction .
   */

  constructor(Client, Commands) {
    this.client = Client
    this.SlashCommands = Commands || null
  }

  /**
   * @method create Instance of SlashCommandBuilder.create() will create a new Slash Command Array and Checked !
   * @param {Array} Commands Arrays of Commands for Slash Command Interaction .
   * @returns {Array} CookedCommands - Filtered Slash Command Value .
   */

  create(Commands) {
    this.SlashCommands = Commands || this.SlashCommands
    if (!this.SlashCommands)
      throw new Error('No Commands have been Passed to Slash Command Handler!')
    let count = 0
    const CookedCommands = []
    for (count = 0; count < Commands.length; count++) {
      CookedCommands.push(this.#CommandPlacement(Commands[0]))
    }
    return CookedCommands
  }

  /**
   * @method #CommandPlacement Placement of Index value of Array of Commands to be Cooked
   * @param {Array} Command Command for Slash Command Interaction .
   * @returns {Array} CookedCommand - Filtered Slash Command Value .
   */

  #CommandPlacement(Command) {
    if (!Command)
      throw SyntaxError('No Application Command Credentials is Detected!')
    const CookedCommand = {}
    let count = 0
    if (Command.name && typeof Command.name === 'string')
      CookedCommand.name = Command.name
    else throw SyntaxError('Invalid Application Command Name is Detected!')
    if (
      Command.description &&
      (typeof Command.description === 'string' ||
        typeof Command.description === 'number')
    )
      CookedCommand.description = Command.description
    else
      throw SyntaxError('Invalid Application Command Description is Detected!')
    if (
      Command.type &&
      typeof Command.type === 'string' &&
      this.#CommandTypePlacement(Command.type)
    )
      CookedCommand.type = this.#CommandTypePlacement(Command.type)
    else if (Command.type)
      throw SyntaxError('Invalid Application Command Type is Detected!')
    if (
      Command.defaultPermission === false ||
      Command.defaultPermission === true
    )
      CookedCommand.defaultPermission = Command.defaultPermission
    else {
      throw SyntaxError(
        'Invalid Application Command Default-Permission is Detected!',
      )
    }
    if (Command.options && Command.options.length > 0) {
      CookedCommand.options = []
      for (count = 0; count < Command.options.length; ++count) {
        CookedCommand.options.push(
          this.#OptionsPlacement(Command.options[count]),
        )
      }
    }
    return CookedCommand
  }

  /**
   * @method #OptionTypePlacement Placement of Index value of Array of Command Options to be Cooked
   * @param {string} Type Option's Type for Slash Command.options Interaction .
   * @returns {string} Type - Raw Discord API Interaction Command.options type Value.
   */

  #OptionTypePlacement(Type) {
    if (!Type)
      throw SyntaxError('No Application Command Type Credential is Detected!')
    let count = 0
    for (
      count = 0;
      count < SlashCommandBuilder.#DefaultOptionsTypes.length;
      ++count
    ) {
      if (
        SlashCommandBuilder.#DefaultOptionsTypes[count].toLowerCase().trim() ===
        Type.toLowerCase().trim()
      )
        return SlashCommandBuilder.#DefaultOptionsTypes[count]
    }
    return void null
  }

  /**
   * @method #CommandTypePlacement Placement of Index value of Array of Command to be Cooked
   * @param {string} Type Command's Type for Slash Command Interaction .
   * @returns {string} Type - Raw Discord API Interaction Command type Value.
   */

  #CommandTypePlacement(Type) {
    if (!Type)
      throw SyntaxError('No Application Command Type Credential is Detected!')
    let count = 0
    for (
      count = 0;
      count < SlashCommandBuilder.#DefaultCommandTypes.length;
      ++count
    ) {
      if (
        SlashCommandBuilder.#DefaultCommandTypes[count].toLowerCase().trim() ===
        Type.toLowerCase().trim()
      )
        return SlashCommandBuilder.#DefaultCommandTypes[count]
    }
    return void null
  }

  /**
   * @method #OptionsPlacement Placement of Index value of Array of Command.options to be Cooked
   * @param {object} Option Command's Option for Slash Command-Option Interaction .
   * @returns {object} CookedOptions - Raw Discord API Interaction Command.options Value.
   */

  #OptionsPlacement(Option) {
    if (!Option) {
      throw SyntaxError(
        'No Application Command Options Credentials is Detected!',
      )
    }
    const CookedOptions = {}
    let count = 0
    if (Option.name && typeof Option.name === 'string')
      CookedOptions.name = Option.name
    else
      throw SyntaxError('Invalid Application Command Option Name is Detected!')
    if (
      Option.description &&
      (typeof Option.description === 'string' ||
        typeof Option.description === 'number')
    )
      CookedOptions.description = Option.description
    else {
      throw SyntaxError(
        'Invalid Application Command Option Description is Detected!',
      )
    }
    if (
      Option.type &&
      typeof Option.type === 'string' &&
      this.#OptionTypePlacement(Option.type)
    )
      CookedOptions.type = this.#OptionTypePlacement(Option.type)
    else throw SyntaxError('Invalid Application Command Type is Detected!')
    if (Option.defaultPermission === false || Option.defaultPermission === true)
      CookedOptions.defaultPermission = Option.defaultPermission
    else {
      throw SyntaxError(
        'Invalid Application Command Option Default-Permission is Detected!',
      )
    }
    if (Option.required === false || Option.required === true)
      CookedOptions.required = Option.required
    else {
      throw SyntaxError(
        'Invalid Application Command Option required? is Detected!',
      )
    }
    if (Option.options && Option.options.length > 0) {
      CookedOptions.options = []
      for (count = 0; count < Option.options.length; ++count) {
        CookedOptions.options.push(
          this.#OptionsPlacement(Option.options[count]),
        )
      }
    }
    if (Option.choices && Option.choices.length > 0) {
      CookedOptions.choices = []
      for (count = 0; count < Option.choices.length; ++count) {
        CookedOptions.choices.push(
          this.#ChoicesPlacement(Option.choices[count]),
        )
      }
    }
    return CookedOptions
  }

  /**
   * @method #ChoicesPlacement Placement of Index value of Array of Command.options.choices to be Cooked
   * @param {object} Choice Command.options's Choices for Slash Command-Option Interaction .
   * @returns {object} CookedChoices - Raw Discord API Interaction Command.options.choices Value.
   */

  #ChoicesPlacement(Choice) {
    if (!Choice) {
      throw SyntaxError(
        'No Application Command Options Credentials is Detected!',
      )
    }
    const CookedChoices = {}
    if (Choice.name && typeof Choice.name === 'string')
      CookedChoices.name = Choice.name
    else
      throw SyntaxError('Invalid Application Command Choice Name is Detected!')
    if (Choice.value) CookedChoices.value = Choice.value
    else
      throw SyntaxError('Invalid Application Command Choice Value is Detected!')
    return CookedChoices
  }
}
