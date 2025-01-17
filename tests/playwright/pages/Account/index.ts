import { Page } from '@playwright/test';
import BasePage from '../Base';
import { AccountSettingsPage } from './Settings';
import { AccountTokenPage } from './Token';
import { AccountUsersPage } from './Users';
import { AccountAppStorePage } from './AppStore';

export class AccountPage extends BasePage {
  readonly settings: AccountSettingsPage;
  readonly token: AccountTokenPage;
  readonly users: AccountUsersPage;
  readonly appStore: AccountAppStorePage;

  constructor(page: Page) {
    super(page);
    this.settings = new AccountSettingsPage(this);
    this.token = new AccountTokenPage(this);
    this.users = new AccountUsersPage(this);
    this.appStore = new AccountAppStorePage(this);
  }

  get() {
    return this.rootPage.locator('body');
  }

  async openAppMenu() {
    await this.rootPage.locator('.nc-menu-accounts').click();
  }

  async signOut() {
    await this.openAppMenu();
    await this.rootPage.locator('div.nc-project-menu-item:has-text("Sign Out"):visible').click();
    await this.rootPage.locator('[data-testid="nc-form-signin"]:visible').waitFor();
  }
}
