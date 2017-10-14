from django import forms

MAX_UPLOAD_SIZE = 10000000

class ContactForm(forms.Form):
    sender = forms.EmailField(required=True)
    subject = forms.CharField(max_length=100,required=True)
    message = forms.CharField(widget=forms.Textarea,required=True)

    def clean_message(self):
        message = self.cleaned_data.get("message", "")
        min_size = 10
        if len(message) < min_size:
            raise forms.ValidationError("The message need to be longer...")

        return message

class UploadForm(forms.Form):
    video = forms.FileField()

    def clean_video(self):
        allowed_formats = [ "avi", "mp4" ]

        video = self.cleaned_data.get("video")
        if not video:
            raise forms.ValidationError("Please select a video file")

        try:
            video_type = video.content_type.split('/')[-1]
        except:
            raise forms.ValidationError("Cannot define video type")

        if video_type not in allowed_formats:
            raise forms.ValidationError("Invalid file type! Only .avi and .mp4 files are accepted")

        if video.size > MAX_UPLOAD_SIZE:
            raise forms.ValidationError("This video is too big! The video can't be bigger than {} bytes".format(MAX_UPLOAD_SIZE))

        return video
