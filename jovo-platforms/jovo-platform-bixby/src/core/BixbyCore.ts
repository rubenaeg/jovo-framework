import {
  Plugin,
  HandleRequest,
  EnumRequestType,
  JovoError,
  ErrorCode,
  SpeechBuilder,
} from 'jovo-core';
import _get from 'lodash.get';
import _set from 'lodash.set';

import { Bixby } from '../Bixby';
import { BixbyCapsule } from './BixbyCapsule';
import { BixbyRequest } from './BixbyRequest';
import { BixbyUser } from '../modules/BixbyUser';
import { BixbyResponse } from './BixbyResponse';

export class BixbyCore implements Plugin {
  install(bixby: Bixby) {
    bixby.middleware('$init')!.use(this.init);
    bixby.middleware('$request')!.use(this.request);
    bixby.middleware('$type')!.use(this.type);
    bixby.middleware('$session')!.use(this.session);
    bixby.middleware('$output')!.use(this.output);
    bixby.middleware('$response')!.use(this.response);
  }

  init(handleRequest: HandleRequest) {
    const { app, host } = handleRequest;

    const requestObject = host.getRequestObject();
    if (requestObject.$vivContext) {
      handleRequest.jovo = new BixbyCapsule(app, host, handleRequest);
    }
  }

  request(capsule: BixbyCapsule) {
    if (!capsule.$host) {
      throw new JovoError("Couldn't access host object.", ErrorCode.ERR, 'jovo-platform-bixby');
    }

    const requestObject = capsule.$host.getRequestObject();
    const requestQuery = capsule.$host.getQueryParams();
    capsule.$request = BixbyRequest.fromJSON(requestObject, requestQuery);
    capsule.$user = new BixbyUser(capsule);
  }

  type(capsule: BixbyCapsule) {
    const request = capsule.$request as BixbyRequest;
    const sessionData = request.getSessionAttributes();

    let type = EnumRequestType.INTENT;

    if (!sessionData || Object.keys(sessionData).length === 0) {
      type = EnumRequestType.LAUNCH;
    }

    capsule.$type = { type };
  }

  session(capsule: BixbyCapsule) {
    const request = capsule.$request as BixbyRequest;
    const sessionData = Object.assign({}, request.getSessionAttributes());
    capsule.$requestSessionAttributes = sessionData;

    if (!capsule.$session) {
      capsule.$session = { $data: {} };
    }

    capsule.$session.$data = sessionData;
  }

  output(capsule: BixbyCapsule) {
    const output = capsule.$output;

    if (!capsule.$response) {
      capsule.$response = new BixbyResponse();
    }

    if (Object.keys(output).length === 0) {
      return;
    }

    const tell = _get(output, 'Bixby.tell') || _get(output, 'tell');
    if (tell) {
      const speech = tell.speech ? SpeechBuilder.toSSML(tell.speech) : '';
      _set(capsule.$response, '_speech.speech', speech);

      const text = tell.speech ? SpeechBuilder.removeSSML(tell.speech) : '';
      _set(capsule.$response, '_speech.text', text);

      _set(capsule.$response, '_shouldEndSession', true);
    }

    const ask = _get(output, 'Bixby.ask') || _get(output, 'ask');
    if (ask) {
      const speech = ask.speech ? SpeechBuilder.toSSML(ask.speech) : '';
      _set(capsule.$response, '_speech.speech', speech);
      _set(capsule.$response, '_speech.text', SpeechBuilder.removeSSML(speech));

      const reprompt = ask.reprompt ? SpeechBuilder.toSSML(ask.reprompt) : '';
      _set(capsule.$response, '_reprompt.speech', reprompt);
      _set(capsule.$response, '_reprompt.text', SpeechBuilder.removeSSML(reprompt));

      _set(capsule.$response, '_shouldEndSession', false);
    }

    if (capsule.$session && capsule.$session.$data) {
      _set(capsule.$response, '_sessionData', capsule.$session.$data);
    }

    // set layout data
    if (capsule.$layout) {
      _set(capsule.$response, '_layout', capsule.$layout);
    }
  }

  response(capsule: BixbyCapsule) {
    const request = capsule.$request as BixbyRequest;
    const response = (capsule.$response as BixbyResponse) || new BixbyResponse();
    if (!response.getSessionId()) {
      response.setSessionId(request.getSessionId()!);
    }
  }
}
