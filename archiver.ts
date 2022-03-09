import { existsSync, unlinkSync, copyFile } from 'fs';
import {config} from 'dotenv';
import { pack } from '7zip-min';

import requests from './api/requests/allureRequests';

config()

const archiveAllureBy7Zip = async (folder: string): Promise<void> => {
  const fileName = `${folder}.zip`;
  const projectDescription = process.env.PROJECT_DESC || 'Тесты портала на playwright'
  const project = process.env.PROJECT_NAME || 'portal-playwright'

  await copyFile('allure.properties', './allure-results/allure.properties', (err) => {
    if (err) throw err;
  });

  await requests.createProject(project, 'portal', projectDescription)

  // @ts-ignore
  await pack(folder, fileName, async (err: Error) => {
    if (err) {
      console.log(err);
    }
    await requests.allureSend(project, fileName, 'allure-results.7z');
    if (existsSync(fileName)) {
      unlinkSync(fileName);
    }
  });
};

(async () => {
  await archiveAllureBy7Zip('./allure-results');
})();
