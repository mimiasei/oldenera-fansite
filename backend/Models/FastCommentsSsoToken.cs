namespace OldenEraFanSite.Api.Models;

public class FastCommentsSsoToken
{
    public string UserDataJSONBase64 { get; set; } = string.Empty;
    public string VerificationHash { get; set; } = string.Empty;
    public long Timestamp { get; set; }
    public string LoginURL { get; set; } = string.Empty;
    public string LogoutURL { get; set; } = string.Empty;
}