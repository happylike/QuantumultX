const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace';

async function testChatGPT() {
  try {
    let region = await Promise.race([getChatGPTReturnRegion(), timeout(7000)]);
    console.log(`ChatGPT Result: region=${region}`);
    
    if (region) {
      result["ChatGPT"] = "<b>ChatGPT: </b>支持 🎉";
      console.log(result["ChatGPT"]);
      return { region, status: STATUS_AVAILABLE };
    } else {
      result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫";
      console.log(result["ChatGPT"]);
      return { status: STATUS_NOT_AVAILABLE };
    }
  } catch (error) {
    console.log("ChatGPT Error:", error);
    return { status: STATUS_ERROR };
  }
}

function getChatGPTReturnRegion() {
  return new Promise((resolve, reject) => {
    let option = {
      url: Region_URL_GPT,
      headers: {
        'User-Agent': UA,
      },
    };
    $task.fetch(option).then(response => {
      let data = response.body;
      console.log("ChatGPT Region Response:", data);
      if (response.statusCode !== 200 || !data) {
        reject('Not Available');
      } else {
        let match = data.match(/"country":"(.+?)"/);
        if (match && match.length === 2) {
          let region = match[1].toUpperCase();
          resolve(region);
        } else {
          reject('Not Available');
        }
      }
    }, reason => {
      reject('Error');
    });
  });
}
