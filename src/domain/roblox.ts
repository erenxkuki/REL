export interface RobloxApiRecord {
  name: string;
  className?: string;
  memberType: 'function' | 'property' | 'event' | 'callback';
  parameters?: string[];
  returnType?: string;
  availability: ('server' | 'client' | 'studio' | 'plugin')[];
  security?: string;
  docs?: string;
}

export interface ModuleDependency {
  from: string;
  to: string;
}
