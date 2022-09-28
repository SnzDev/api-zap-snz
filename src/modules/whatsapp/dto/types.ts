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
  phone_number?: string;
  message: string;
  file_url?: string;
}

export class ISendMessageSurvey implements ISendMessage {
  phone_number: string;
  message: string;
  first_option: string;
  first_answer: string;
  second_option: string;
  second_answer: string;
  file_url?: string;
}
