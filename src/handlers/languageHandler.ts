export class LanguageHandler {
  public static language= {
    commands: {
      help:{
        description: "Gibt eine Liste von Befehlen zurück, welche du benutzen kannst!",
        error: {
          unknown: "Der Befehl ist nicht bekannt. Gib `$0help` ein für eine Liste von Befehlen."
        },
        labels: {
          command: "Befehl"
        },
        success:{
          type:"Gib `$0<$1> [args]` ein um einen $1 auszuführen!"
        },
        options: {
          command: "Der Befehl über den du Hilfe brauchst."
        }
      },
      addBotChannel: {
        description: "Verlinkt ein Voice-Channel zu einem BotChannel.",
        error: {
          usageTitle: "Falsche Benutzung",
          textTitle: "Textchannel ausgewählt",
          textDescription: "Text-Channel ausgewählt, der Kanal muss ein Voice-Channel sein",
          sqlTitle: "DB Error",
          sqlDescription: "Konnte Channel nicht speichern"
        },
        labels: {
          success: "Channel konfiguriert",
          description: "Channel `$0` wurde konfiguriert. Weitere Channels folgen dem Schema `$1`"
        },
        options: {
          channel: "Der Kanal der als BotChannel konfiguriert werden soll",
          channel_names: "Der String für den Namen der neuen Kanäle"
        }
      },
      removeBotChannel: {
        description: "Entfernt die Konfiguration eines Bot-Channels.",
        error: {
          usageTitle: "Falsche Benutzung",
          sqlTitle: "DB Error",
          sqlDescription: "Konnte Channel nicht entfernen"
        },
        labels: {
          success: "Channel entfernt",
          description: "Channel `$0` wurde entfernt."
        }
      }
    },
    handlers: {
      command: {
        error: {
          unknown: "Der Befehl ist nicht bekannt. Nutze `$0help` um eine List an Befehlen zu erhalten.",
          generic_error: "Es gab einen Fehler während der Ausführung von `$0$1`.",
          general_format: "Dein Befehl ist falsch formatiert:\n`$0<Befehl> [args] [--<option> [option-arg]]`",
          args_format: "Deine Argumente sind falsch formatiert.\n*Hinweis: Argumente mit Leerzeichen müssen durch \" abgegrenzt sein und können keine weiteren \" enthalten.*",
          params_format: "Deine Optionen sind falsch formatiert.\n*Hinweis: Optionen müssen mit '--' starten und __können__ ein weiteres Argument enthalten.*"
        }
      },
      emoji: {
        labels: {
          did_you_mean: "Meintest du",
          synonyms: "Synonyme",
          usage: "Reagiere mit der angezeigten Zahl auf diese Nachricht um den Befehl auszuführen!"
        }
      },
      musicPlayer: {
        labels: {
          playing: "Nächster Titel",
          volume: "Lautstärke",
          currently_playing: "Aktuell wird gespielt",
          disconnected: "Verbindung getrennt",
          disconnecting_emptyChannel: "Habe den Kanal verlassen, weil keiner mehr zugehört hat :(",
          disconnecting_emptyQueue: "Queue leer! Verbindung getrennt."
        }
      },
      permissions: {
        error: "Unzureichende Berechtigung um `$0$1` zu nutzen!"
      }
    },
    general: {
      error: "Fehler",
      description: "Beschreibung",
      example: "Beispiel",
      usage: "Benutzung",
      reason: "Grund",
      server: "Server",
      user: "Mitglied",
      message: "Nachricht",
      title:"Titel"
    },
    error: {
      user_mention: "Du must ein Mitglied erwähnen",
      user_not_found: "Mitglied nicht gefunden",
      invalid_permissions: "Unzureichende Berechtigung",
      invalid_usage: "Falsche Benutzung"
    }
  }
  /**
   * Replaces preset args with values in a string
   * @param input
   * @param args
   * @return the filled string
   */
  public static replaceArgs(input: string, args: string[]) {
    // console.log(input);
    // console.log(args);
    for (let i = 0; i<args.length; i++) {
      input = input.split('$'+i).join(args[i]);
    }
    return input;
  }
}