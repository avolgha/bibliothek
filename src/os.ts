import * as dns from "node:dns";
import * as os from "node:os";
import * as process from "node:process";

export interface OsSpecResult {
    computer: {
        cpus: {
            list: os.CpuInfo[];
            usage: NodeJS.CpuUsage;
        };
        ipAddresses: string[];
        memory: {
            free: number;
            usage: NodeJS.MemoryUsage;
            total: number;
        };
        network: NodeJS.Dict<os.NetworkInterfaceInfo[]>;
        uptime: number;
    };
    os: {
        arch:
            | "arm"
            | "arm64"
            | "ia32"
            | "mips"
            | "mipsel"
            | "ppc"
            | "ppc64"
            | "s390"
            | "s390x"
            | "x64";
        host: string;
        platform: NodeJS.Platform;
        release: string;
        type: string;
        version: string;
    };
    user: {
        home: string;
        info: os.UserInfo<string>;
        tmp: string;
    };
    node: {
        env: NodeJS.ProcessEnv;
        pid: number;
        release: NodeJS.ProcessRelease;
        title: string;
        versions: NodeJS.ProcessVersions;
    };
}

/**
 * Get computer specs like the cpus, the memory or the network interfaces.
 *
 * @return The specs from the current computer.
 */
export function os_spec(): OsSpecResult {
    return {
        computer: {
            cpus: {
                list: os.cpus(),
                usage: process.cpuUsage(),
            },
            ipAddresses: dns.getServers(),
            memory: {
                free: os.freemem(),
                usage: process.memoryUsage(),
                total: os.totalmem(),
            },
            network: os.networkInterfaces(),
            uptime: os.uptime(),
        },
        os: {
            arch: os.arch() as OsSpecResult["os"]["arch"],
            host: os.hostname(),
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
            version: os.version(),
        },
        user: {
            home: os.homedir(),
            info: os.userInfo(),
            tmp: os.tmpdir(),
        },
        node: {
            env: process.env,
            pid: process.pid,
            release: process.release,
            title: process.title,
            versions: process.versions,
        },
    };
}
