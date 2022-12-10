import RPC from "discord-rpc";
import fetch from 'node-fetch';


		let date = new Date();
		let sec = date.getSeconds();

		var title;
		var album;
		var artist;
		var year;
		var isPaused;
		var pausedText;

		var previousStatus;
		var oldTitle;

		var res = fetch('http://<your jellyfin url>/Sessions?api_key=<your api key>', {
			method: 'GET',
			headers: {
						'Accept': 'application/json',
					},
		})
		.then(response => 
			response.json().then(data => ({
						data: data,
						status: response.status
					})
			).then(res => {
					title = res.data[0].NowPlayingItem.Name
					album = res.data[0].NowPlayingItem.Album
					artist = res.data[0].NowPlayingItem.AlbumArtist
					isPaused = res.data[0].PlayState.IsPaused
		}));

		setTimeout(()=>{
		  setInterval(()=>{

			var res = fetch('http://<your jellyfin url>/Sessions?api_key=<your api key>', {
				method: 'GET',
				headers: {
							'Accept': 'application/json',
						},
			})
			.then(response => 
				response.json().then(data => ({
							data: data,
							status: response.status
						})
				).then(res => {
						oldTitle = title;
						previousStatus = isPaused
						title = res.data[0].NowPlayingItem.Name
						album = res.data[0].NowPlayingItem.Album
						artist = res.data[0].NowPlayingItem.AlbumArtist
						isPaused = res.data[0].PlayState.IsPaused
						if (!(title == oldTitle) || !(isPaused == previousStatus))
						{
							if (isPaused)
							{
								pausedText = "Paused on: "
							}
							else
							{
								pausedText = "Playing: "
							}
							rpc.setActivity({
								details: pausedText + title,
								state: album + ", " + artist,
								largeImageKey: "jellyfin",
							});
							oldTitle = title;
						}
			}));

		  }, 15 * 1000);
		}, (15 - sec) * 1000);


const rpc = new RPC.Client({
    transport: "ipc"
});

rpc.on("ready", () => {

	if (isPaused)
	{
		pausedText = "Paused on: "
	}
	else
	{
		pausedText = "Playing: "
	}
    
    rpc.setActivity({
		details: pausedText + title,
		state: album + ", " + artist,
		largeImageKey: "jellyfin",
	});
    
    console.log("Rich Presence Started!");
});

rpc.login({
    clientId: "1050974796873216000" // Do not change, my application with "Music with Jellyfin" and the cover photo.
})


console.log("Make sure to run xvfb-run discord &")
