using System.Net;

namespace backend.Helpers
{
    public static class IpValidator
    {
        public static bool isValidIP(string ipAddress, string subnet)
        {
            if (!IPAddress.TryParse(ipAddress, out var _))
                return false;

            var parts = subnet.Split('/');
            if (parts.Length != 2)
                return false;

            if (!IPAddress.TryParse(parts[0], out var subnetIp))
                return false;

            if (!int.TryParse(parts[1], out int prefix) || prefix < 0 || prefix > 32)
                return false;

            var ipBytes = IPAddress.Parse(ipAddress).GetAddressBytes();
            var subnetBytes = subnetIp.GetAddressBytes();

            if (ipBytes.Length != 4 || subnetBytes.Length != 4)
                return false;

            uint ip = BitConverter.ToUInt32(ipBytes.Reverse().ToArray(), 0);
            uint subnetValue = BitConverter.ToUInt32(subnetBytes.Reverse().ToArray(), 0);
            uint mask = uint.MaxValue << (32 - prefix);

            uint network = subnetValue & mask;
            uint broadcast = network | ~mask;

            return ip >= network + 1 && ip <= broadcast - 1;
        }
    }
}
