export class IBodyTest {
  sessionId: string;
  message: string;
  buttons: IButton[];
}

export class IButton {
  option: string;
  response: string;
}

export class ISendMessage {
  phone_number: string;
  message: string;
  file_url?: string;
}
