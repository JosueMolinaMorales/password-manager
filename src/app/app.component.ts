import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { invoke } from '@tauri-apps/api';
import { ask, message, open } from '@tauri-apps/api/dialog';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { appDir } from '@tauri-apps/api/path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'password-manager';
  username: FormControl = new FormControl();
  password: FormControl = new FormControl();

  async displayMessage() {
    const res = await invoke('greet', { name: "Josue" });
    console.log(res);
  }

  async login() {
    // console.log(this.username.value)
    try {
      // const res = await invoke('login', { username: this.username.value, password: this.password.value }) as any;
      
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        sendNotification('Hello There!');
        // sendNotification({ title: "Hello User!", body: `username: ${res?.username}`})
      }
      const yes = await ask('Are you sure?', 'Tauri');
      const yes2 = await ask(' This action cannot be reverted. Are you sure?', { title: "Tauri", type: "warning" });

      await message('Hello There', {title: "Hello", type: "warning"});

      // const selected = await open({
      //   multiple: true,
      //   filters: [{
      //     name: "Image",
      //     extensions: ['png', 'jpeg']
      //   }]
      // });

      const appDirPath = await appDir();
      console.log(appDirPath);
    } catch (error) {
      console.log(error);
    }
    
  }
}
