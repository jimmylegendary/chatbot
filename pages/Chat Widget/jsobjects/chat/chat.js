export default {
	appname: "appsmith-chat-widget",
	// Store the max and total reponses to limit public usage.
  // Set this to zero to disable.
	maxResponses: 30,
	// This stores the total chat history, and will be modified as the user asks questions
	history: [{role: "CHATBOT", message: "토론 주제를 입력해 주세요"}],
	openAIapiKey: '',
	serpApiKey: '',
	
	// The main function - send the user prompt to the AI and add the result to the history for viewing.
	async submit(){
		let newMessage = { role: "USER", message: inp_userPrompt.text };
		this.history.push(newMessage);

		// Send the user prompt to the AI
		await this.send();

		// Reset the input widget and prepare for the next prompt.
		resetWidget('inp_userPrompt');
		return this.history;
	},

	async send() {
		// Only send the message if the user is under the max amount.
		if (this.totalResponses() <= this.maxResponses || this.maxResponses === 0) {
			let reply = await n8nAI.run();
			this.history.push({role:"CHATBOT", message: reply.output});
			this.totalResponses ++;
			storeValue(this.appname, this.history);
		}
		else {
			let url = appsmith.URL.fullPath + "?fork=true";
			let reply = `I'm sorry, this template only allows ${this.maxResponses} responses. Please <a href='" + url + "'>fork this template</a> and adjust the settings for your own use.`;
			this.history.push({role:"CHATBOT", message: reply});
		}
	},
	
	totalResponses() {
		return this.history.filter(item => item.role === "USER").length;
	},

	onload() {
		let chatHistory = appsmith.store[this.appname];
		if (chatHistory != undefined) {
			this.history = chatHistory;
		}
	},
	
	setAPIKey() {
		this.openAIapiKey = OpenAIapiKeyInput.text;
		this.serpApiKey = SerpApiKeyInput.text;
	},

	reset() {
		removeValue(this.appname);
		this.totalResponses = 0;
		this.history = [{role: "CHATBOT", message: "토론 주제를 입력해 주세요"}];
	},
	
	test() {
		console.log(appsmith.store[this.appname]);
	}

}