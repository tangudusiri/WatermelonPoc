import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
    static table = 'users';

    @field('email') email;
    @field('password') password;
    @field('profilePic') profilePic;
}
