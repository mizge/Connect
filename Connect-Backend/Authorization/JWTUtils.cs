using Connect_Backend.Helpers;
using Connect_Backend.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Connect_Backend.Authorization
{
    public interface IJwtUtils
    {
        public string GenerateToken(User user);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }

    public class JwtUtils : IJwtUtils
    {
        private readonly UserSecrets _appSettings;

        public JwtUtils(IOptions<UserSecrets> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public string GenerateRefreshToken()
        {
            byte[] randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string GenerateToken(User user)
        {
            // generate token that is valid for 15 minutes
            JwtSecurityTokenHandler tokenHandler = new();
            byte[] key = Encoding.ASCII.GetBytes(_appSettings.JWTSecret);

            SecurityTokenDescriptor tokenDescriptor = new()
            {
                Issuer = _appSettings.Issuer,
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Sid, user.Id.ToString()), new Claim(ClaimTypes.Role, user.Role.Name.ToString().Trim()) }),
                //Expires = DateTime.UtcNow.AddMinutes(15),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            byte[] key = Encoding.ASCII.GetBytes(_appSettings.JWTSecret);

            TokenValidationParameters tokenValidationParameters = new()
            {
                ValidateAudience = false,
                ValidateIssuer = true,
                ValidIssuer = _appSettings.Issuer,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };

            JwtSecurityTokenHandler tokenHandler = new();
            ClaimsPrincipal principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
    }
}
