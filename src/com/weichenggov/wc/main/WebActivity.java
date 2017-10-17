package com.weichenggov.wc.main;

import com.alipay.sdk.app.PayTask;
import com.alipay.sdk.util.H5PayResultModel;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class WebActivity extends Activity{
	private WebView webView;
	private ValueCallback mUploadMessage;  
	private final static int FILECHOOSER_RESULTCODE = 1;  
	private final static int ALIPAY_RESULT=101;
	private ProgressBar progressBar;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_web);
//		Toast.makeText(this, "web", Toast.LENGTH_LONG).show();

		progressBar=(ProgressBar)findViewById(R.id.layout_progress);

		findViewById(R.id.back_img).setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				if (webView.canGoBack()) {
					webView.goBack();   //后退
				} else {
					onBackPressed();
				}
			}
		});
		findViewById(R.id.close_img).setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				onBackPressed();
			}
		});
		

		TextView txtTitle = (TextView) findViewById(R.id.title_txt);
		webView = (WebView) findViewById(R.id.webView);


		String title = getIntent().getStringExtra("title");
		String url = getIntent().getStringExtra("url");


		txtTitle.setText(""+title);

		if (TextUtils.isEmpty(url)){
			Toast.makeText(this, "url is null", Toast.LENGTH_LONG).show();
			return;
		}
		

		final WebSettings settings = webView.getSettings();
		settings.setSupportZoom(true);          //支持缩放
		settings.setBuiltInZoomControls(true);  //启用内置缩放装置
		settings.setAllowFileAccess(true);        //允许访问本地資源
		settings.setJavaScriptEnabled(true);    //启用JS脚本

		settings.setBlockNetworkImage(true);

//        settings.setDomStorageEnabled(true);
		settings.setUseWideViewPort(true);
		settings.setLoadWithOverviewMode(true);

		settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);

		//加载url
		webView.loadUrl(url);
		
		webView.setWebViewClient(new WebViewClient() {
			//在webView中打开新窗口
			@Override
			public boolean shouldOverrideUrlLoading( WebView view, String url) {
				
			    final PayTask task = new PayTask(WebActivity.this);
			    //处理订单信息
			    final String ex = task.fetchOrderInfoFromH5PayUrl(url); 
			    if (!TextUtils.isEmpty(ex)) {
			        //调用支付接口进行支付
			        new Thread(new Runnable() {
			            public void run() {
			                H5PayResultModel result = task.h5Pay(ex, true);
			                //处理返回结果
			                if (!TextUtils.isEmpty(result.getReturnUrl())) {
			                	Message msg=new Message();
			                	msg.what=ALIPAY_RESULT;
			                	msg.obj=result.getReturnUrl();
			                	mhander.sendMessage(msg);
//			                	view.loadUrl(result.getReturnUrl());
			                }
			            }
			        }).start();
			    } else {
			    	if (url.startsWith("tel:")) {
						Intent intent = new Intent(Intent.ACTION_VIEW,Uri.parse(url));
						startActivity(intent);
					} else {
						view.loadUrl(url);  //加载新的url
					}
			    }
			    return true;
				
				
				
			}

			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);

				settings.setBlockNetworkImage(false);
			}
		});
	
		
		
	
		webView.setWebChromeClient(new WebChromeClient() {  
		    @Override
			public void onProgressChanged(WebView view, int newProgress) {
				super.onProgressChanged(view, newProgress);
				if(newProgress ==100 ){  
					progressBar.setVisibility(ProgressBar.GONE);
                }
				//progressBar.setVisibility(ProgressBar.GONE);
			}
            // The undocumented magic method override  
            // Eclipse will swear at you if you try to put @Override here  
            // For Android 3.0+  
            public void openFileChooser(ValueCallback uploadMsg) {  
  
                mUploadMessage = uploadMsg;  
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);  
                i.addCategory(Intent.CATEGORY_OPENABLE);  
                i.setType("image/*");  
                WebActivity.this.startActivityForResult(  
                        Intent.createChooser(i, "File Chooser"),  
                        FILECHOOSER_RESULTCODE);  
            }  
  
            // For Android 3.0+  
            public void openFileChooser(ValueCallback uploadMsg,  
                    String acceptType) {  
                mUploadMessage = uploadMsg;  
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);  
                i.addCategory(Intent.CATEGORY_OPENABLE);  
                i.setType("*/*");  
                WebActivity.this.startActivityForResult(  
                        Intent.createChooser(i, "File Browser"),  
                        FILECHOOSER_RESULTCODE);  
            }  
  
            // For Android 4.1  
            public void openFileChooser(ValueCallback uploadMsg,  
                    String acceptType, String capture) {  
                mUploadMessage = uploadMsg;  
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);  
                i.addCategory(Intent.CATEGORY_OPENABLE);  
                i.setType("image/*");  
                WebActivity.this.startActivityForResult(  
                        Intent.createChooser(i, "File Chooser"),  
                        WebActivity.FILECHOOSER_RESULTCODE);  
            }  
            
            
  
        });  

		webView.setOnKeyListener(new View.OnKeyListener() {
			@Override
			public boolean onKey(View arg0, int keyCode, KeyEvent event) {
				if (event.getAction() == KeyEvent.ACTION_DOWN) {
					if (keyCode == KeyEvent.KEYCODE_BACK) {
						if (webView.canGoBack()) {
							webView.goBack();   //后退
						} else {
							onBackPressed();
						}
						return true;    //已处理
					}
				}
				return false;
			}
		});

	}
	
	@Override  
    protected void onActivityResult(int requestCode, int resultCode,  
            Intent intent) {  
        if (requestCode == FILECHOOSER_RESULTCODE) {  
            if (null == mUploadMessage)  
                return;  
            Uri result = intent == null || resultCode != RESULT_OK ? null  
                    : intent.getData();  
            mUploadMessage.onReceiveValue(result);  
            mUploadMessage = null;  
        }  
    }  

	@Override
	protected void onResume() {
		webView.onResume();

		super.onResume();
	}

	@Override
	protected void onPause() {
		webView.onPause();

		super.onPause();
	}

	@Override
	protected void onDestroy() {
		webView.clearCache(true);
		super.onDestroy();
	}

	Handler mhander=new Handler(){
		@Override
		public void handleMessage(Message msg) {
			// TODO Auto-generated method stub
			switch (msg.what) {
			case ALIPAY_RESULT:
				webView.loadUrl((String)msg.obj);
				break;

			default:
				break;
			}
			
		}
	};

}
