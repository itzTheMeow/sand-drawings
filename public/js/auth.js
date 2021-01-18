let AuthHandler = {};

async function Auth() {
  if (localStorage.getItem("discord-auth")) {
    let auth = JSON.parse(localStorage.getItem("discord-auth"));
    let tokenType = auth.tokenType;
    let accessToken = auth.accessToken;
    let user = {};

    await fetch("https://discordapp.com/api/users/@me", {
      headers: {
        authorization: `${tokenType} ${accessToken}`
      }
    })
      .then(res => res.json())
      .then(response => {
        user.avatar = response.avatar;
        user.discriminator = response.discriminator;
        user.flags = response.flags;
        user.id = response.id;
        user.locale = response.locale;
        user.mfa_enabled = response.mfa_enabled;
        user.username = response.username;
        user.discrim = response.discriminator;
        user.avatarURL = `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`;
        user.tag = response.username + "#" + response.discriminator;
      })
      .catch(console.error);

    console.log(user);
    AuthHandler.user = user;
    AuthHandler.accessToken = accessToken;
    AuthHandler.tokenType = tokenType;

    AuthHandler.AddToDM = function(DM_ID) {
      jQuery.ajax({
        url: `https://discordapp.com/api/channels/${DM_ID}/recipients/${user.id}`,
        type: "PUT",
        data: { access_token: accessToken },
        success: function(result) {
          console.log(result);
        }
      });
    };
  } else {
    AuthHandler.failed = true;
  }
}

Auth();
