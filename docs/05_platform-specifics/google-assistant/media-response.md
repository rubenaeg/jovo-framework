# [Platform Specific Features](../) > [Google Assistant](./README.md) > Media Response

Learn how to use the Google Action Media Response with Jovo.

* [Introduction](#introduction)
* [Features](#features)
  * [Play a File](#play-a-file)
* [Directives](#directive)


## Introduction

The Google Action Media Response allows you to play audio content, which is longer than 120 seconds. While using the Media Response you loose control of the `stop`, `cancel` and `resume` commands, since Google handles these themselves, without your app even receiving the request.

You can check out the official documentation [here](https://developers.google.com/actions/assistant/responses#media_responses).

## Features

### Play a File

```javascript
// Adds audio file to the response
this.googleAction().audioPlayer().play(url, name);
```

To send the response you can use either `tell()` or `ask()`, which have both different use cases. 
```javascript
this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one');
this.tell('Enjoy the song!');
```
If you use `tell()` it will be handled as a [final response](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#finalresponse) and you wont receive a callback that the audio playback is completed. 

The `ask()` method on the other hand will keep the session open so you can receive the callback, but it forces you to add [Suggestion Chips](./visual.md#suggestion-chips './visual#suggestion-chips') to your response.
```javascript
this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one');
this.googleAction().showSuggestionChips(['Chip 1', 'Chip 2']);
this.ask('Enjoy the song');
```

### Set Track Metadata

The function `play` has an optional value, you can add some information as description, image, alt... according to [Google Media Response](https://developers.google.com/actions/assistant/responses#media_responses).

```javascript
this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one', {"description": "A description", "icon": {"url": "https://www.somewhere.com/image.png", "alt": "A accessibility text"}});
```


## Directive

The callback after the audio playback is finished will be mapped to the `GoogleAction.Finished` intent, which has to be placed in either the `'MEDIARESPONSE'` or the `'AUDIOPLAYER'` directive of your handler.

```javascript
'MEDIARESPONSE': {
  'GoogleAction.Finished': function() { 
    // ...
  },
},
```

You can also use the `'AUDIOPLAYER'` directive for cross-platform compatibility with the Alexa Audioplayer:

```javascript
'AUDIOPLAYER': {
  'GoogleAction.Finished': function() { 
    // ...
  },
},
```

<!--[metadata]: {"title": "Google Assistant Media Response", 
                "description": "Learn how to use the Google Action Media Response with Jovo.",
                "activeSections": ["platforms", "assistant", "assistant_media-response"],
                "expandedSections": "platforms",
                "inSections": "platforms",
                "breadCrumbs": {
                  "Docs": "docs/", 
				          "Platforms": "docs/platforms",
                  "Google Assistant": ""
                },
		            "commentsID": "framework/docs/google-assistant/media-response",
		"route": "docs/google-assistant/media-response"
                }-->