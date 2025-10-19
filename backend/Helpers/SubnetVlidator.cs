using System.Net;

namespace backend.Helpers
{
    public static class SubnetValidator
    {
        public static bool IsValidCidr(string cidr)
        {
            try
            {
                var parts = cidr.Split('/');
                if (parts.Length != 2) return false;

                if (!IPAddress.TryParse(parts[0], out var ipAddress))
                    return false;

                if (!int.TryParse(parts[1], out var prefix) || prefix < 0 || prefix > 32)
                    return false;

                var ipBytes = ipAddress.GetAddressBytes();
                uint ip = BitConverter.ToUInt32(ipBytes.Reverse().ToArray(), 0);
                uint mask = uint.MaxValue << (32 - prefix);

                uint networkAddress = ip & mask;

                return networkAddress == ip;
            }
            catch
            {
                return false;
            }
        }
    }
}
