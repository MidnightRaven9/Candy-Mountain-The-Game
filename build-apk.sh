#!/usr/bin/env bash
# Build Shift Mountain APK for Android (WebView-based, no Gradle)
set -euo pipefail

GAME_DIR="/root/projects/shift-mountain"
ANDROID_PROJECT="/root/projects/shift-mountain-android"
BUILD="$ANDROID_PROJECT/build"
SDK="/opt/android-sdk"
BUILD_TOOLS="/opt/android-sdk/build-tools/34.0.0"
PLATFORM="/opt/android-sdk/platforms/android-34/android.jar"
AAPT2="/usr/lib/android-sdk/build-tools/debian/aapt2"
ZIPALIGN="/usr/lib/android-sdk/build-tools/debian/zipalign"
APKSIGNER="/opt/android-sdk/build-tools/34.0.0/apksigner"
D8="/opt/android-sdk/build-tools/34.0.0/d8"

echo "==> Shift Mountain APK Builder"
echo "=================================="

# ============================================================
# STEP 1: Verify game files exist
# ============================================================
if [ ! -f "$GAME_DIR/index.html" ]; then
    echo "ERROR: index.html not found in game directory"
    exit 1
fi
if [ ! -f "$GAME_DIR/js/phaser.min.js" ]; then
    echo "ERROR: js/phaser.min.js not found"
    exit 1
fi
if [ ! -f "$GAME_DIR/js/scenes/MenuScene.js" ]; then
    echo "ERROR: MenuScene.js not found"
    exit 1
fi
if [ ! -f "$GAME_DIR/js/scenes/GameScene.js" ]; then
    echo "ERROR: GameScene.js not found"
    exit 1
fi
if [ ! -f "$GAME_DIR/js/scenes/GameOverScene.js" ]; then
    echo "ERROR: GameOverScene.js not found"
    exit 1
fi
echo "✓ Game files verified"

# ============================================================
# STEP 2: Create Android project structure
# ============================================================
rm -rf "$ANDROID_PROJECT"
mkdir -p "$ANDROID_PROJECT/java/com/shif/mountain"
mkdir -p "$ANDROID_PROJECT/res/values"
mkdir -p "$ANDROID_PROJECT/res/layout"
mkdir -p "$ANDROID_PROJECT/assets/www/js/scenes"
mkdir -p "$ANDROID_PROJECT/build"

echo "✓ Android project structure created"

# ============================================================
# STEP 3: AndroidManifest.xml (simple WebView manifest)
# ============================================================
cat > "$ANDROID_PROJECT/AndroidManifest.xml" << 'MANIFEST'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.shif.mountain"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.Light.NoTitleBar.Fullscreen">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout|uiMode">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
MANIFEST

cat > "$ANDROID_PROJECT/res/values/strings.xml" << 'STRINGS'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Shift Mountain</string>
</resources>
STRINGS

cat > "$ANDROID_PROJECT/res/layout/activity_main.xml" << 'LAYOUT'
<?xml version="1.0" encoding="utf-8"?>
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
LAYOUT

cat > "$ANDROID_PROJECT/java/com/shif/mountain/MainActivity.java" << 'JAVA'
package com.shif.mountain;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.app.Activity;

public class MainActivity extends Activity {
    private WebView webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webview = new WebView(this);
        webview.setWebViewClient(new WebViewClient());
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setDomStorageEnabled(true);
        webview.loadUrl("file:///android_asset/www/index.html");
        setContentView(webview, new android.view.ViewGroup.LayoutParams(
            android.view.ViewGroup.LayoutParams.MATCH_PARENT,
            android.view.ViewGroup.LayoutParams.MATCH_PARENT));
    }
}
JAVA

echo "✓ Android project files created"

# ============================================================
# STEP 4: Copy game assets into assets/www/
# ============================================================
cp "$GAME_DIR/index.html" "$ANDROID_PROJECT/assets/www/index.html"
cp "$GAME_DIR/js/phaser.min.js" "$ANDROID_PROJECT/assets/www/js/phaser.min.js"
cp "$GAME_DIR/js/scenes/MenuScene.js" "$ANDROID_PROJECT/assets/www/js/scenes/MenuScene.js"
cp "$GAME_DIR/js/scenes/GameScene.js" "$ANDROID_PROJECT/assets/www/js/scenes/GameScene.js"
cp "$GAME_DIR/js/scenes/GameOverScene.js" "$ANDROID_PROJECT/assets/www/js/scenes/GameOverScene.js"
echo "✓ Game assets copied"

# ============================================================
# STEP 5: Compile & link APK
# ============================================================
echo ""
echo "=================================="
echo "==> Building Shift Mountain APK"
echo "=================================="

rm -rf "$BUILD"
mkdir -p "$BUILD/res" "$BUILD/gen" "$BUILD/classes" "$BUILD/dex"

# aapt2 compile from the Android res folder (not game dir!)
"$AAPT2" compile --dir "$ANDROID_PROJECT/res" -o "$BUILD/res/res.zip" 2>&1 | tail -2

# aapt2 link
"$AAPT2" link -o "$BUILD/base.apk" -I "$PLATFORM" \
    --manifest "$ANDROID_PROJECT/AndroidManifest.xml" \
    -R "$BUILD/res/res.zip" \
    --java "$BUILD/gen" \
    --auto-add-overlay 2>&1 | tail -2

# javac MainActivity
javac -source 8 -target 8 -classpath "$PLATFORM" -d "$BUILD/classes" \
    "$ANDROID_PROJECT/java/com/shif/mountain/MainActivity.java" 2>&1 | tail -2

# d8
"$D8" --min-api 21 --lib "$PLATFORM" --output "$BUILD/dex" \
    "$BUILD/classes/com/shif/mountain/MainActivity.class" 2>&1 | tail -2

# add dex to base.apk and zipalign
( cd "$BUILD/dex" && zip -q -j "$BUILD/base.apk" classes.dex )
echo "✓ classes.dex added to base.apk"

# add assets to APK
if [ -d "$ANDROID_PROJECT/assets/www" ]; then
    ( cd "$ANDROID_PROJECT" && zip -q -r "$BUILD/base.apk" assets/www )
    echo "✓ Assets added to base.apk"
else
    echo "⚠ No assets/www dir"
fi

"$ZIPALIGN" -f 4 "$BUILD/base.apk" "$BUILD/aligned.apk"

# sign
KEYSTORE="$BUILD/debug.keystore"
keytool -genkeypair -v -keystore "$KEYSTORE" \
    -storepass android -alias androiddebugkey -keypass android \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US" >/dev/null 2>&1
"$APKSIGNER" sign \
    --ks "$KEYSTORE" --ks-pass pass:android --key-pass pass:android \
    --out "$ANDROID_PROJECT/Shift-Mountain.apk" "$BUILD/aligned.apk" >/dev/null 2>&1

# verify
"$APKSIGNER" verify --print-certs "$ANDROID_PROJECT/Shift-Mountain.apk" 2>&1 | head -3

echo ""
echo "=================================="
echo "==> DONE! Shift Mountain APK"
echo "=================================="
echo "APK located at: $ANDROID_PROJECT/Shift-Mountain.apk"
echo "=================================="
