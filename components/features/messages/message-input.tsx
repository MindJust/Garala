'use client'
return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-background">
        <div className="flex items-end gap-2">
            {/* Media Actions */}
            <div className="flex items-center gap-1">
                <ImageUpload conversationId={conversationId} />
                <AudioRecorder conversationId={conversationId} />
                <MeetingScheduler conversationId={conversationId} />
            </div>

            {/* Text Input */}
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez un message..."
                className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px] max-h-[120px]"
                rows={1}
                disabled={sending}
            />

            {/* Send Button */}
            <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || sending}
                className="rounded-lg h-11 w-11 flex-shrink-0"
            >
                <Send className="h-5 w-5" />
            </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </p>
    </form>
)
}
