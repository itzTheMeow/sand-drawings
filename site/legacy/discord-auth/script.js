window.onload = () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));

  if (fragment.has("access_token")) {
    const accessToken = fragment.get("access_token");
    const tokenType = fragment.get("token_type");

    let obj = { accessToken: accessToken, tokenType: tokenType };
    localStorage.setItem("discord-auth", JSON.stringify(obj));

    window.location.href = "https://sand-drawings.glitch.me/?auth=pass";
  } else {
    window.location.href = "https://sand-drawings.glitch.me/?auth=fail";
  }
};
