package com.weichenggov.wc.main;
import io.vov.vitamio.MediaPlayer;
import io.vov.vitamio.Vitamio;
import io.vov.vitamio.widget.MediaController;
import io.vov.vitamio.widget.VideoView;
import android.app.Activity;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class VideoPlayerActivity extends Activity {
	private VideoView videoView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Vitamio.isInitialized(getApplicationContext());
		setContentView(R.layout.activity_video_player);
		initView();
	}
	
	public void initView(){
		videoView = (VideoView) findViewById(R.id.video_play_videoView);
		
		Bundle data = getIntent().getExtras();
		String path = "";
		if(data != null){
			path = data.getString("url");
		}
		if(path == null || "".equals(path.trim())){
			Toast.makeText(this, "获取视频链接失败", Toast.LENGTH_LONG).show();
			return;
		}
		
//		path = "http://gslb.miaopai.com/stream/oxX3t3Vm5XPHKUeTS-zbXA__.mp4";
		videoView.setVideoPath(path);
		MediaController mController = new MediaController(this);
		videoView.setMediaController(mController);
		videoView.requestFocus();
		mController.show();

		videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
			@Override
			public void onPrepared(MediaPlayer mediaPlayer) {
				mediaPlayer.setPlaybackSpeed(1.0f);
			}
		});
	}
	
	public void close(View v){
		finish();
	}
}
