import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';
export default class Note extends Model {
  static table = 'notes';
  @field('title') note;
  @field('description') desc;
  @readonly @date('created_at') createdAt;
  @readonly @date('last_modified_at') lastModifiedAt;
  @field('status') status
}