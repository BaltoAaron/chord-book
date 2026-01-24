### Update for adding Song Key
Add a new text field named 'key' to store the song key.  Even though 'key' may seem to be a dropdown of available keys, the 'key' field shoudl be a text field for keyed in entry by the user.  Update the supabase schama and the song editing page to add the new field.  On the song edit page, the new 'Key' field should be between the Title and Chords fields.

### Add Setlist Settings page with ordered/alphabetic switch
Create a new 'Setlist Settings' page available from the Setlist edit page.  The link to the Setting page should be a gear icon to the right of the Display Setlist button.  The Settings page should have single toggle setting for 'Alphabetical Order'.  The toggle should be off by default.  Update the supabase schema.sql for the new settings field in the Setlists table.  Also create a new schema-migration sql file for the change.  Do not yet update Setlist edit page to take the Alphabetical Order setting into account.
